import { imageLoader, init as csCoreInit, Types } from '@cornerstonejs/core';
import { init, wadouri } from '../dicom-image-loader-dev';

const tests = [
  // Tests openjpegwasm_decode.wasm
  {
    source: 'assets/testImages/CT1_J2KR',
    expectedMetadata: jasmine.objectContaining<Types.IImage>({
      rows: 512,
      columns: 512,
      imageFrame: jasmine.objectContaining({
        bitsPerPixel: 16,
        photometricInterpretation: 'MONOCHROME2',
      }),
      columnPixelSpacing: 0.661468,
      rowPixelSpacing: 0.661468,
    }),
    expectedPixelDataHash: 'osvdZhAWz1YO0xIgICQJC5IiRVHQXTIb1TSVGMlrt60=',
  },
  //   Tests openjphjs.wasm
  {
    source: 'assets/testImages/CT1_JPH.dcm',
    expectedMetadata: jasmine.objectContaining<Types.IImage>({
      rows: 512,
      columns: 512,
      imageFrame: jasmine.objectContaining({
        bitsPerPixel: 16,
        photometricInterpretation: 'MONOCHROME2',
      }),
      columnPixelSpacing: 0.661468,
      rowPixelSpacing: 0.661468,
    }),
    expectedPixelDataHash: 'osvdZhAWz1YO0xIgICQJC5IiRVHQXTIb1TSVGMlrt60=',
  },
  // Tests openjpegwasm_decode.wasm
  {
    source: 'assets/testImages/CT2_J2KR',
    expectedMetadata: jasmine.objectContaining<Types.IImage>({
      rows: 512,
      columns: 512,
      imageFrame: jasmine.objectContaining({
        bitsPerPixel: 16,
        photometricInterpretation: 'MONOCHROME2',
      }),
      columnPixelSpacing: 0.468,
      rowPixelSpacing: 0.468,
    }),
    expectedPixelDataHash: '9sE9EXxHeEyV2S+b8hbT5dvgj5GBiuTzZkzHSGGo1DE=',
  },
  //   tests openjpegwasm_decode.wasm
  {
    source:
      'assets/testImages/CTImage.dcm_JPEG2000LosslessOnlyTransferSyntax_1.2.840.10008.1.2.4.90.dcm',
    expectedMetadata: jasmine.objectContaining<Types.IImage>({
      rows: 512,
      columns: 512,
      imageFrame: jasmine.objectContaining({
        bitsPerPixel: 16,
        photometricInterpretation: 'MONOCHROME2',
      }),
      columnPixelSpacing: 0.675781,
      rowPixelSpacing: 0.675781,
    }),
    expectedPixelDataHash: '1uhbGTt+V7cZu7Qt1m67t6sY8ii/hSmCqmN+/oQakvM=',
  },
  // Test  charlswasm_decode.wasm
  {
    source:
      'assets/testImages/CTImage.dcm_JPEGLSLosslessTransferSyntax_1.2.840.10008.1.2.4.80.dcm',
    expectedMetadata: jasmine.objectContaining<Types.IImage>({
      rows: 512,
      columns: 512,
      imageFrame: jasmine.objectContaining({
        bitsPerPixel: 16,
        photometricInterpretation: 'MONOCHROME2',
      }),
      columnPixelSpacing: 0.675781,
      rowPixelSpacing: 0.675781,
    }),
    expectedPixelDataHash: '1uhbGTt+V7cZu7Qt1m67t6sY8ii/hSmCqmN+/oQakvM=',
  },
  //    Tests charlswasm_decode.wasm
  {
    source:
      'assets/testImages/CTImage.dcm_JPEGLSLossyTransferSyntax_1.2.840.10008.1.2.4.81.dcm',
    expectedMetadata: jasmine.objectContaining<Types.IImage>({
      rows: 512,
      columns: 512,
      imageFrame: jasmine.objectContaining({
        bitsPerPixel: 16,
        photometricInterpretation: 'MONOCHROME2',
      }),
      columnPixelSpacing: 0.675781,
      rowPixelSpacing: 0.675781,
    }),
    expectedPixelDataHash: 'KEwXY9wDqOVQ+iD84qC9LJdOL38P+BKumGns4kp8sCo=',
  },
  // non wasm test
  {
    source:
      'assets/testImages/CTImage.dcm_BigEndianExplicitTransferSyntax_1.2.840.10008.1.2.2.dcm',
    expectedMetadata: jasmine.objectContaining<Types.IImage>({
      rows: 512,
      columns: 512,
      imageFrame: jasmine.objectContaining({
        photometricInterpretation: 'MONOCHROME2',
      }),
      columnPixelSpacing: 0.675781,
      rowPixelSpacing: 0.675781,
    }),
    expectedPixelDataHash: '1uhbGTt+V7cZu7Qt1m67t6sY8ii/hSmCqmN+/oQakvM=',
  },
  // Non wasm test
  {
    source: 'assets/testImages/CTImage.dcm',
    expectedMetadata: jasmine.objectContaining<Types.IImage>({
      rows: 512,
      columns: 512,
      imageFrame: jasmine.objectContaining({
        photometricInterpretation: 'MONOCHROME2',
      }),
      columnPixelSpacing: 0.675781,
      rowPixelSpacing: 0.675781,
    }),
    expectedPixelDataHash: '1uhbGTt+V7cZu7Qt1m67t6sY8ii/hSmCqmN+/oQakvM=',
  },
  // libjpegturbowasm_decode.wasm
  {
    source:
      'assets/testImages/CTImage.dcm_JPEGProcess1TransferSyntax_1.2.840.10008.1.2.4.50.dcm',
    expectedMetadata: jasmine.objectContaining<Types.IImage>({
      rows: 512,
      columns: 512,
      imageFrame: jasmine.objectContaining({
        photometricInterpretation: 'MONOCHROME2',
      }),
      columnPixelSpacing: 0.675781,
      rowPixelSpacing: 0.675781,
    }),
    expectedPixelDataHash: 'cStTzfkCyPzB6bd6Bxri0mMDSKT/F27TFAtpyroKHEg=',
  },
  // Non wasm test
  {
    source:
      'assets/testImages/CTImage.dcm_JPEGProcess2_4TransferSyntax_1.2.840.10008.1.2.4.51.dcm',
    expectedMetadata: jasmine.objectContaining<Types.IImage>({
      rows: 512,
      columns: 512,
      imageFrame: jasmine.objectContaining({
        photometricInterpretation: 'MONOCHROME2',
      }),
      columnPixelSpacing: 0.675781,
      rowPixelSpacing: 0.675781,
    }),
    expectedPixelDataHash: '5XlJx7OdYVuYH9whIsxfqh254T4z849ISDUEVosgG+8=',
  },
  {
    source:
      'assets/testImages/CTImage.dcm_JPEGProcess14SV1TransferSyntax_1.2.840.10008.1.2.4.70.dcm',
    expectedMetadata: jasmine.objectContaining<Types.IImage>({
      rows: 512,
      columns: 512,
      imageFrame: jasmine.objectContaining({
        photometricInterpretation: 'MONOCHROME2',
      }),
      columnPixelSpacing: 0.675781,
      rowPixelSpacing: 0.675781,
    }),
    expectedPixelDataHash: '8H9ycf7kHWqVvf4FF8mjDZzQhyz0QC02Po6u7APUugE=',
  },
  {
    source: 'assets/testImages/us-multiframe-ybr-full-422.dcm',
    expectedMetadata: jasmine.objectContaining<Types.IImage>({
      rows: 600,
      columns: 800,
      imageFrame: jasmine.objectContaining({
        photometricInterpretation: 'YBR_FULL_422',
      }),
    }),
    expectedPixelDataHash: 'lpFVAYsrVp1TCyK/3FN2UMcWLFa603g/HR7KstVYq/A=',
  },
];

let csInInitialised = false;

describe('dicom-image-loader', () => {
  beforeAll(async () => {
    if (csInInitialised) {
      return;
    }
    await csCoreInit();

    init({
      webWorkerFactory: () => {
        return new Worker(
          new URL('../app/cornerstone-image-decoder.worker.ts', import.meta.url)
        );
      },
      decodeConfig: {
        wasmUrlCodecCharls: './charlswasm_decode.wasm',
        wasmUrlCodecLibJpegTurbo8bit: './libjpegturbowasm_decode.wasm',
        wasmUrlCodecOpenJpeg: './openjpegwasm_decode.wasm',
        wasmUrlCodecOpenJph: './openjphjs.wasm',
      },
    });
    csInInitialised = true;
  });
  tests.forEach((test) => {
    it(`should load image from ${test.source}`, async () => {
      const dcmBlob = await fetch(test.source).then((response) =>
        response.blob()
      );
      const imageId = wadouri.fileManager.add(dcmBlob);
      const image = await imageLoader.loadImage(imageId).catch((e) => {
        console.error(e);
        throw e;
      });
      expect(image).toEqual(test.expectedMetadata);
      expect(await sha256ToBase64(image!)).toBe(test.expectedPixelDataHash);
    });
  });
});

async function sha256ToBase64(image: Types.IImage) {
  // Convert the message to a Uint8Array
  const pixelData = image.getPixelData();
  const pixelDataArray = new Uint8Array(pixelData);
  const pixelDataHash = await crypto.subtle.digest('SHA-256', pixelDataArray);

  // Convert hash buffer to a base64 string
  const base64String = btoa(
    String.fromCharCode(...new Uint8Array(pixelDataHash))
  );

  return base64String;
}
