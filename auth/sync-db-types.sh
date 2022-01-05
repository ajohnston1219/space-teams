#!/bin/bash

npm run @databases/pg-schema-cli --database postgres://spacecraft:spacecraft@localhost:5432/spacecraft --directory src/repository/__generated__
