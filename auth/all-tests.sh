#!/bin/bash

npm test
docker-compose up --build -d db
sleep 3
npx jest integration --runInBand
docker-compose kill db
