#!/usr/bin/env bash

_build_styles() {
    sass -q --load-path=node_modules/@gooddata styles/scss:styles/css
}

_clean() {
    rm -rf dist
    rm -rf esm
    rm -rf styles/css
}

_common-build() {
    _build_styles
}

build() {
    _common-build
    concurrently "npm run build-cjs" "npm run build-esm"
}

build-dev() {
    _clean
    _common-build
    tsc -p tsconfig.dev.json
}

build-dev-watch() {
    _common-build
    _build_styles
    tsc --watch -p tsconfig.dev.json
}

build-styles() {
  rm -rf styles/css
  _build_styles
}

FLAG=$1
if [ "$FLAG" = "--dev" ]; then
    build-dev
elif [ "$FLAG" = "--dev-watch" ]; then
    build-dev-watch
elif [ "$FLAG" = "--styles" ]; then
    build-styles
else
    build
fi
