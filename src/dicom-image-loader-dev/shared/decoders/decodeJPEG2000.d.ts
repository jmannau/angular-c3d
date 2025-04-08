import type { Types } from '@cornerstonejs/core';
import type { WebWorkerDecodeConfig } from '../../types';
export declare function initialize(decodeConfig?: WebWorkerDecodeConfig, wasmUrlCodecOpenJpeg?: string): Promise<void>;
declare function decodeAsync(compressedImageFrame: any, imageInfo: any, wasmUrlCodecOpenJpeg?: string): Promise<Types.IImageFrame>;
export default decodeAsync;
