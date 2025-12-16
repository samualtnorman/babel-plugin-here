#!/bin/sh
set -ex
rm -rf dist
./rolldown.config.js
scripts/emit-dts.sh
scripts/emit-package-json.js
scripts/eta.js < src/readme.md > dist/readme.md
cp readme.md src/env.d.ts dist
