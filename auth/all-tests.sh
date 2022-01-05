#!/bin/bash

npm test
docker-compose up --build -d db
npx jest integration
docker-compose kill db
