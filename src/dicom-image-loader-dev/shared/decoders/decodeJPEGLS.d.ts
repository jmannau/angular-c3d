import type { Types } from '@cornerstonejs/core';
import type { WebWorkerDecodeConfig } from '../../types';
export declare function initialize(decodeConfig?: WebWorkerDecodeConfig, wasmUrlCodecCharls?: string): Promise<void>;
declare function decodeAsync(compressedImageFrame: any, imageInfo: any, wasmUrlCodecCharls?: string): Promise<Types.IImageFrame>;
export default decodeAsync;
