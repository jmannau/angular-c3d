import { setOptions } from './imageLoader/internal/index';
import registerLoaders from './imageLoader/registerLoaders';
import { getWebWorkerManager } from '@cornerstonejs/core';
const workerFn = () => {
    const instance = new Worker(new URL('./decodeImageFrameWorker.js', import.meta.url), { type: 'module' });
    return instance;
};
function init(options = {}) {
    setOptions(options);
    registerLoaders();
    const isValidWorkerFactory = validateWorkerFactoryOption(options);
    const workerManager = getWebWorkerManager();
    const maxWorkers = options?.maxWebWorkers || getReasonableWorkerCount();
    workerManager.registerWorker('dicomImageLoader', isValidWorkerFactory ? options.webWorkerFactory : workerFn, {
        maxWorkerInstances: maxWorkers,
    });
}
function getReasonableWorkerCount() {
    if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) {
        return Math.max(1, Math.floor(navigator.hardwareConcurrency / 2));
    }
    return 1;
}
export default init;
function validateWorkerFactoryOption(options) {
    const isValidWorkerFactory = options.webWorkerFactory && typeof options.webWorkerFactory === 'function';
    if (!!options.webWorkerFactory && !isValidWorkerFactory) {
        console.warn('webWorkerFactory should be a function that returns a Worker instance.');
    }
    return isValidWorkerFactory;
}
