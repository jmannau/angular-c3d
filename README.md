# AngularC3d

This is demo project, showing how to integrate Cornerstone3D with Angular.

The steps to integrate Cornerstone3D with Angular are as follows:

1. use `ng g web-worker` to create a web worker
2. import `decodeImageFrameWorker` from `@cornerstonejs/dicom-image-loader` in the web worker. This will allow the angular build process to include the appropriate dicom-image-loader worker in the build. For an example, see `src/app/cornerstone-image-decoder.worker.ts`
3. Update `angular.json` to include the required wasm assets in the build output as assets. There are 4 wasm files that need to be included. The paths are relative to the `angular.json` file. See `./angular.json`
4. Initialise `@cornerstonejs/dicom-image-loader` setting a custom webWorkerFactory function to load the web worker from #2 above and the correct paths to the wasm files in #3. see `src/app/cornerstone-viewport/cornerstone-viewport.component.ts`

This demo project uses a development version of `@cornerstonejs/dicom-image-loader` manually copied into `src/dicom-image-loader-dev`

## Development

`npm install` to install the dependencies.
`npm start` to start the development server.

## Production Build

`npm run build` to build the project for production. The output will be in the `dist` folder.
To verify that the production build works, run `npx http-server -p 4200 dist/angular-c3d/browser` and open `http://localhost:4200` in your browser.
