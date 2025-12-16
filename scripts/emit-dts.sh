#!/bin/sh
set -ex
tsc --project src --emitDeclarationOnly --noCheck --noEmit false
