import type { ByteArray } from 'dicom-parser';
import type { LoaderDecodeOptions } from '../../types';
export declare function initialize(decodeConfig?: LoaderDecodeOptions, wasmUrlCodecOpenJph?: string): Promise<void>;
declare function decodeAsync(compressedImageFrame: ByteArray, imageInfo: any, wasmUrlCodecOpenJph?: string): Promise<any>;
export default decodeAsync;
