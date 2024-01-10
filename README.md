# pixi-conway

A conway's game of life simulation in the browser, running on PixiJS.

## Build

Use the following steps:

- `yarn` to install the dependencies.
- `yarn build:debug` to build for development.
    - This could also be handled via `yarn watch` for building on changes.
- `yarn build:release` to build a minified bundle for production.

***Note**: In order to run locally, you should run a simple http server in the dist directory. Example: `python -m http.server` and load `http://localhost:8080` in your browser.*
