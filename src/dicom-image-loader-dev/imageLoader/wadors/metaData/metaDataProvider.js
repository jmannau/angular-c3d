import * as dicomParser from 'dicom-parser';
import { Enums, utilities } from '@cornerstonejs/core';
import getNumberValues from './getNumberValues';
import getNumberValue from './getNumberValue';
import getOverlayPlaneModule from './getOverlayPlaneModule';
import metaDataManager, { retrieveMultiframeMetadataImageId, } from '../metaDataManager';
import getValue from './getValue';
import { getMultiframeInformation, getFrameInformation, } from '../combineFrameInstance';
import { extractOrientationFromMetadata, extractPositionFromMetadata, } from './extractPositioningFromMetadata';
import { getImageTypeSubItemFromMetadata } from './NMHelpers';
import isNMReconstructable from '../../isNMReconstructable';
import { getInstanceModule, instanceModuleNames, } from '../../getInstanceModule';
import { getUSEnhancedRegions } from './USHelpers';
function metaDataProvider(type, imageId) {
    const { MetadataModules } = Enums;
    if (type === MetadataModules.MULTIFRAME) {
        const { metadata, frame } = retrieveMultiframeMetadataImageId(imageId);
        if (!metadata) {
            return;
        }
        const { PerFrameFunctionalGroupsSequence, SharedFunctionalGroupsSequence, NumberOfFrames, } = getMultiframeInformation(metadata);
        if (PerFrameFunctionalGroupsSequence || NumberOfFrames > 1) {
            const { shared, perFrame } = getFrameInformation(PerFrameFunctionalGroupsSequence, SharedFunctionalGroupsSequence, frame);
            return {
                NumberOfFrames,
                PerFrameFunctionalInformation: perFrame,
                SharedFunctionalInformation: shared,
            };
        }
        return {
            NumberOfFrames,
        };
    }
    const metaData = metaDataManager.get(imageId);
    if (!metaData) {
        return;
    }
    if (type === MetadataModules.GENERAL_STUDY) {
        return {
            studyDescription: getValue(metaData['00081030']),
            studyDate: dicomParser.parseDA(getValue(metaData['00080020'])),
            studyTime: dicomParser.parseTM(getValue(metaData['00080030'], 0, '')),
            accessionNumber: getValue(metaData['00080050']),
        };
    }
    if (type === MetadataModules.GENERAL_SERIES) {
        return {
            modality: getValue(metaData['00080060']),
            seriesInstanceUID: getValue(metaData['0020000E']),
            seriesNumber: getNumberValue(metaData['00200011']),
            studyInstanceUID: getValue(metaData['0020000D']),
            seriesDate: dicomParser.parseDA(getValue(metaData['00080021'])),
            seriesTime: dicomParser.parseTM(getValue(metaData['00080031'], 0, '')),
            acquisitionDate: dicomParser.parseDA(getValue(metaData['00080022'])),
            acquisitionTime: dicomParser.parseTM(getValue(metaData['00080032'], 0, '')),
        };
    }
    if (type === MetadataModules.GENERAL_IMAGE) {
        return {
            sopInstanceUID: getValue(metaData['00080018']),
            instanceNumber: getNumberValue(metaData['00200013']),
            lossyImageCompression: getValue(metaData['00282110']),
            lossyImageCompressionRatio: getNumberValue(metaData['00282112']),
            lossyImageCompressionMethod: getValue(metaData['00282114']),
        };
    }
    if (type === MetadataModules.PATIENT) {
        return {
            patientID: getValue(metaData['00100020']),
            patientName: getValue(metaData['00100010']),
        };
    }
    if (type === MetadataModules.PATIENT_STUDY) {
        return {
            patientAge: getNumberValue(metaData['00101010']),
            patientSize: getNumberValue(metaData['00101020']),
            patientSex: getValue(metaData['00100040']),
            patientWeight: getNumberValue(metaData['00101030']),
        };
    }
    if (type === MetadataModules.NM_MULTIFRAME_GEOMETRY) {
        const modality = getValue(metaData['00080060']);
        const imageSubType = getImageTypeSubItemFromMetadata(metaData, 2);
        return {
            modality,
            imageType: getValue(metaData['00080008']),
            imageSubType,
            imageOrientationPatient: extractOrientationFromMetadata(metaData),
            imagePositionPatient: extractPositionFromMetadata(metaData),
            sliceThickness: getNumberValue(metaData['00180050']),
            spacingBetweenSlices: getNumberValue(metaData['00180088']),
            pixelSpacing: getNumberValues(metaData['00280030'], 2),
            numberOfFrames: getNumberValue(metaData['00280008']),
            isNMReconstructable: isNMReconstructable(imageSubType) && modality.includes('NM'),
        };
    }
    if (type === MetadataModules.IMAGE_PLANE) {
        let imageOrientationPatient = extractOrientationFromMetadata(metaData);
        let imagePositionPatient = extractPositionFromMetadata(metaData);
        const pixelSpacing = getNumberValues(metaData['00280030'], 2);
        let columnPixelSpacing = null;
        let rowPixelSpacing = null;
        let rowCosines = null;
        let columnCosines = null;
        let usingDefaultValues = false;
        if (pixelSpacing) {
            rowPixelSpacing = pixelSpacing[0];
            columnPixelSpacing = pixelSpacing[1];
        }
        else {
            usingDefaultValues = true;
            rowPixelSpacing = 1;
            columnPixelSpacing = 1;
        }
        if (imageOrientationPatient) {
            rowCosines = [
                parseFloat(imageOrientationPatient[0]),
                parseFloat(imageOrientationPatient[1]),
                parseFloat(imageOrientationPatient[2]),
            ];
            columnCosines = [
                parseFloat(imageOrientationPatient[3]),
                parseFloat(imageOrientationPatient[4]),
                parseFloat(imageOrientationPatient[5]),
            ];
        }
        else {
            rowCosines = [1, 0, 0];
            columnCosines = [0, 1, 0];
            usingDefaultValues = true;
            imageOrientationPatient = [...rowCosines, ...columnCosines];
        }
        if (!imagePositionPatient) {
            imagePositionPatient = [0, 0, 0];
            usingDefaultValues = true;
        }
        return {
            frameOfReferenceUID: getValue(metaData['00200052']),
            rows: getNumberValue(metaData['00280010']),
            columns: getNumberValue(metaData['00280011']),
            imageOrientationPatient,
            rowCosines,
            columnCosines,
            imagePositionPatient,
            sliceThickness: getNumberValue(metaData['00180050']),
            sliceLocation: getNumberValue(metaData['00201041']),
            pixelSpacing,
            rowPixelSpacing,
            columnPixelSpacing,
            usingDefaultValues,
        };
    }
    if (type === MetadataModules.ULTRASOUND_ENHANCED_REGION) {
        return getUSEnhancedRegions(metaData);
    }
    if (type === MetadataModules.CALIBRATION) {
        const modality = getValue(metaData['00080060']);
        if (modality === 'US') {
            const enhancedRegion = getUSEnhancedRegions(metaData);
            return {
                sequenceOfUltrasoundRegions: enhancedRegion,
            };
        }
    }
    if (type === MetadataModules.IMAGE_URL) {
        return getImageUrlModule(imageId, metaData);
    }
    if (type === MetadataModules.CINE) {
        return getCineModule(imageId, metaData);
    }
    if (type === MetadataModules.IMAGE_PIXEL) {
        return {
            samplesPerPixel: getNumberValue(metaData['00280002']),
            photometricInterpretation: getValue(metaData['00280004']),
            rows: getNumberValue(metaData['00280010']),
            columns: getNumberValue(metaData['00280011']),
            bitsAllocated: getNumberValue(metaData['00280100']),
            bitsStored: getNumberValue(metaData['00280101']),
            highBit: getValue(metaData['00280102']),
            pixelRepresentation: getNumberValue(metaData['00280103']),
            planarConfiguration: getNumberValue(metaData['00280006']),
            pixelAspectRatio: getValue(metaData['00280034']),
            smallestPixelValue: getNumberValue(metaData['00280106']),
            largestPixelValue: getNumberValue(metaData['00280107']),
            redPaletteColorLookupTableDescriptor: getNumberValues(metaData['00281101']),
            greenPaletteColorLookupTableDescriptor: getNumberValues(metaData['00281102']),
            bluePaletteColorLookupTableDescriptor: getNumberValues(metaData['00281103']),
            redPaletteColorLookupTableData: getNumberValues(metaData['00281201']),
            greenPaletteColorLookupTableData: getNumberValues(metaData['00281202']),
            bluePaletteColorLookupTableData: getNumberValues(metaData['00281203']),
        };
    }
    if (type === MetadataModules.VOI_LUT) {
        return {
            windowCenter: getNumberValues(metaData['00281050'], 1),
            windowWidth: getNumberValues(metaData['00281051'], 1),
            voiLUTFunction: getValue(metaData['00281056']),
        };
    }
    if (type === MetadataModules.MODALITY_LUT) {
        return {
            rescaleIntercept: getNumberValue(metaData['00281052']),
            rescaleSlope: getNumberValue(metaData['00281053']),
            rescaleType: getValue(metaData['00281054']),
        };
    }
    if (type === MetadataModules.SOP_COMMON) {
        return {
            sopClassUID: getValue(metaData['00080016']),
            sopInstanceUID: getValue(metaData['00080018']),
        };
    }
    if (type === MetadataModules.PET_ISOTOPE) {
        const radiopharmaceuticalInfo = getValue(metaData['00540016']);
        if (radiopharmaceuticalInfo === undefined) {
            return;
        }
        return {
            radiopharmaceuticalInfo: {
                radiopharmaceuticalStartTime: dicomParser.parseTM(getValue(radiopharmaceuticalInfo['00181072'], 0, '')),
                radiopharmaceuticalStartDateTime: getValue(radiopharmaceuticalInfo['00181078'], 0, ''),
                radionuclideTotalDose: getNumberValue(radiopharmaceuticalInfo['00181074']),
                radionuclideHalfLife: getNumberValue(radiopharmaceuticalInfo['00181075']),
            },
        };
    }
    if (type === MetadataModules.OVERLAY_PLANE) {
        return getOverlayPlaneModule(metaData);
    }
    if (type === 'transferSyntax') {
        return getTransferSyntax(imageId, metaData);
    }
    if (type === MetadataModules.PET_SERIES) {
        return {
            correctedImage: getValue(metaData['00280051']),
            units: getValue(metaData['00541001']),
            decayCorrection: getValue(metaData['00541102']),
        };
    }
    if (type === MetadataModules.PET_IMAGE) {
        return {
            frameReferenceTime: getNumberValue(metaData['00541300']),
            actualFrameDuration: getNumberValue(metaData['00181242']),
        };
    }
    if (type === 'instance') {
        return getInstanceModule(imageId, metaDataProvider, instanceModuleNames);
    }
}
export function getImageUrlModule(imageId, metaData) {
    const { transferSyntaxUID } = getTransferSyntax(imageId, metaData);
    const isVideo = utilities.isVideoTransferSyntax(transferSyntaxUID);
    const imageUrl = imageId.substring(7);
    const thumbnail = imageUrl.replace('/frames/', '/thumbnail/');
    let rendered = imageUrl.replace('/frames/', '/rendered/');
    if (isVideo) {
        rendered = rendered.replace('/rendered/1', '/rendered');
    }
    return {
        isVideo,
        rendered,
        thumbnail,
    };
}
export function getCineModule(imageId, metaData) {
    const cineRate = getValue(metaData['00180040']);
    return {
        cineRate,
        numberOfFrames: getNumberValue(metaData['00280008']),
    };
}
export function getTransferSyntax(imageId, metaData) {
    return {
        transferSyntaxUID: getValue(metaData['00020010']) ||
            getValue(metaData['00083002']),
    };
}
export default metaDataProvider;
