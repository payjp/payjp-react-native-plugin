#!/bin/bash -eux
openapi-generator-cli generate \
-i token-api.yaml \
-g typescript-fetch \
-t .templates \
-o src
