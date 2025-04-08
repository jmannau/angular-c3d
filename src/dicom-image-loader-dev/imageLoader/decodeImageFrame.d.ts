import type { Types } from '@cornerstonejs/core';
import type { ByteArray } from 'dicom-parser';
import type { DICOMLoaderImageOptions, LoaderDecodeOptions } from '../types';
declare function decodeImageFrame(imageFrame: Types.IImageFrame, transferSyntax: string, pixelData: ByteArray, canvas: HTMLCanvasElement, options: DICOMLoaderImageOptions, decodeConfig: LoaderDecodeOptions): Promise<Types.IImageFrame>;
export default decodeImageFrame;
