// Import the Cornerstone dicom-image-loader web worker so that it can be
// included in the output by the Angular build system.
//
// This is replaced by the manual import below to use the dev version of the
// decodeImageFrameWorker.
// import {decodeImageFrame} from '@cornerstonejs/dicom-image-loader';

// import the dev version of the decodeImageFrameWorker
import '../dicom-image-loader-dev/decodeImageFrameWorker';
