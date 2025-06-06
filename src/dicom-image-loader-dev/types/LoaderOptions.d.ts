import type { LoaderDecodeOptions } from './LoaderDecodeOptions';
import type { LoaderXhrRequestError, LoaderXhrRequestParams } from './XHRRequest';
export interface LoaderOptions {
    maxWebWorkers?: number;
    open?: (xhr: XMLHttpRequest, url: string, defaultHeaders: Record<string, string>, params: LoaderXhrRequestParams) => void;
    beforeSend?: (xhr: XMLHttpRequest, imageId: string, defaultHeaders: Record<string, string>, params: LoaderXhrRequestParams) => Record<string, string> | void;
    beforeProcessing?: (xhr: XMLHttpRequest) => Promise<ArrayBuffer>;
    imageCreated?: (imageObject: unknown) => void;
    onloadstart?: (event: ProgressEvent<EventTarget>, params: unknown) => void;
    onloadend?: (event: ProgressEvent<EventTarget>, params: unknown) => void;
    onreadystatechange?: (event: Event, params: unknown) => void;
    onprogress?: (event: ProgressEvent<EventTarget>, params: unknown) => void;
    errorInterceptor?: (error: LoaderXhrRequestError) => void;
    strict?: boolean;
    decodeConfig?: LoaderDecodeOptions;
    webWorkerFactory?: () => Worker;
}
