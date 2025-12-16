#!/bin/sh
set -ex
rm -rf dist
./rolldown.config.js
scripts/emit-types.sh
scripts/emit-package-json.js
cp readme.md license src/env.d.ts dist
