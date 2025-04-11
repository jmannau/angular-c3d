// src/app/cornerstone-viewport/cornerstone-viewport.component.ts

import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  cache,
  init as csRenderInit,
  Enums,
  RenderingEngine,
  Types,
  volumeLoader,
} from '@cornerstonejs/core';
import { init as csToolsInit } from '@cornerstonejs/tools';
import { api } from 'dicomweb-client';
import cornerstoneDICOMImageLoader, {
  init as dicomImageLoaderInit,
} from '../../dicom-image-loader-dev';

@Component({
  selector: 'app-cornerstone-viewport',
  template: `
    <div
      #viewportElement
      [style.width.px]="512"
      [style.height.px]="512"
      [style.backgroundColor]="'#000'"
    ></div>
  `,
  standalone: true,
})
export class CornerstoneViewportComponent implements OnInit {
  @ViewChild('viewportElement', { static: true }) viewportElement!: ElementRef;
  private running = false;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.setup();
    });
  }

  constructor(private ngZone: NgZone) {}

  async setup() {
    if (this.running) {
      return;
    }
    this.running = true;

    async function createImageIdsAndCacheMetaData({
      // @ts-ignore
      StudyInstanceUID,
      // @ts-ignore
      SeriesInstanceUID,
      // @ts-ignore
      SOPInstanceUID = null,
      // @ts-ignore
      wadoRsRoot,
      // @ts-ignore
      client = null,
    }) {
      const SOP_INSTANCE_UID = '00080018';
      const SERIES_INSTANCE_UID = '0020000E';

      const studySearchOptions = {
        studyInstanceUID: StudyInstanceUID,
        seriesInstanceUID: SeriesInstanceUID,
      };

      // @ts-ignore
      client =
        client ||
        new api.DICOMwebClient({ url: wadoRsRoot as string, singlepart: true });

      // @ts-ignore
      const instances = await client.retrieveSeriesMetadata(studySearchOptions);
      // @ts-ignore
      const imageIds = instances.map((instanceMetaData) => {
        // @ts-ignore
        const SeriesInstanceUID =
          instanceMetaData[SERIES_INSTANCE_UID].Value[0];
        const SOPInstanceUIDToUse =
          SOPInstanceUID || instanceMetaData[SOP_INSTANCE_UID].Value[0];

        const prefix = 'wadors:';

        const imageId =
          prefix +
          wadoRsRoot +
          '/studies/' +
          StudyInstanceUID +
          '/series/' +
          SeriesInstanceUID +
          '/instances/' +
          SOPInstanceUIDToUse +
          '/frames/1';

        cornerstoneDICOMImageLoader.wadors.metaDataManager.add(
          imageId,
          instanceMetaData
        );
        return imageId;
      });

      // we don't want to add non-pet
      // Note: for 99% of scanners SUV calculation is consistent bw slices

      return imageIds;
    }

    await csRenderInit();
    await csToolsInit();
    /**
     * Initialize cornerstoneDICOMImageLoader
     *
     *
     */
    dicomImageLoaderInit({
      /**
       *
       * Create a custom web worker factory to load the angular worker.  This allows
       * us to build the worker using the standard angular build process.
       */
      webWorkerFactory: () => {
        return new Worker(
          new URL('../cornerstone-image-decoder.worker.ts', import.meta.url)
        );
      },
      /**
       * Customse the
       */
      decodeConfig: {
        wasmUrlCodecCharls: './charlswasm_decode.wasm',
        wasmUrlCodecLibJpegTurbo8bit: './libjpegturbowasm_decode.wasm',
        wasmUrlCodecOpenJpeg: './openjpegwasm_decode.wasm',
        wasmUrlCodecOpenJph: './openjphjs.wasm',
      },
    });

    const imageIds = await createImageIdsAndCacheMetaData({
      StudyInstanceUID:
        '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
      SeriesInstanceUID:
        '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
      wadoRsRoot: 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb',
    });

    const renderingEngineId = 'myRenderingEngine';
    const renderingEngine = new RenderingEngine(renderingEngineId);
    const viewportId = 'CT_STACK';

    const viewportInput = {
      viewportId,
      type: Enums.ViewportType.ORTHOGRAPHIC,
      element: this.viewportElement.nativeElement,
      defaultOptions: {
        orientation: Enums.OrientationAxis.SAGITTAL,
      },
    };

    renderingEngine.enableElement(viewportInput);

    const viewport = renderingEngine.getViewport(
      viewportId
    ) as Types.IVolumeViewport;

    const volumeId = 'myVolume';
    const volume = (await volumeLoader.createAndCacheVolume(volumeId, {
      imageIds: imageIds,
    })) as Types.IStreamingImageVolume;

    volume.load();

    viewport.setVolumes([{ volumeId }]);

    viewport.render();

    setTimeout(() => {
      cache;
    }, 2000);
  }
}
