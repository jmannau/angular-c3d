import getEncapsulatedImageFrame from './getEncapsulatedImageFrame';
import getUncompressedImageFrame from './getUncompressedImageFrame';
function getPixelData(dataSet, frameIndex = 0) {
    const pixelDataElement = dataSet.elements.x7fe00010 || dataSet.elements.x7fe00008;
    if (!pixelDataElement) {
        return null;
    }
    if (pixelDataElement.encapsulatedPixelData) {
        return getEncapsulatedImageFrame(dataSet, frameIndex);
    }
    return getUncompressedImageFrame(dataSet, frameIndex);
}
export default getPixelData;
