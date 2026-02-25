# Cornerstone3D + Angular Demo

This repo was built to demonstrate https://github.com/cornerstonejs/cornerstone3D/pull/1982 PR for integrating Cornerstone3D with Angular.

This is demo project, showing how to integrate Cornerstone3D with Angular.

This project integrates @cornerstonejs/dicom-image-loader with Angular by:

1. using `patch-package` to patch the installed node_module files to load the wasm paths from the Angular assets folder. See `patches/` folder for the patch files. This is automatically applied when you run `npm install` because of the `postinstall` script in `package.json`
2. using Angular build tools to include the required wasm files in `assets/wasm` - see `angular.json` for the configuration to include these files in the build output.
3. Using Angular to create a custom web worker that imports the `decodeImageFrameWorker` from `@cornerstonejs/dicom-image-loader. This packages and builds the worker correctly using the standard Angular build tools. See `src/app/cornerstone-image-decoder.worker.ts` for the worker code.
4. Adding a custom C3D WebWorker to load the required `dicomImageLoader` worker for C3D to work. see `src/app/cornerstone-viewport/cornerstone-viewport.component.ts` for the configuration of the C3D web worker to use our custom Angular web worker.

## Development

`npm install` to install the dependencies.
`npm start` to start the development server.

## Tests

`npm test` to run the unit tests.

## Production Build

`npm run build` to build the project for production. The output will be in the `dist` folder.
To verify that the production build works, run `npx http-server -p 4200 dist/angular-c3d/browser` and open `http://localhost:4200` in your browser.
