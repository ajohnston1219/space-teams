#!/bin/bash

docker-compose up --build -d db
docker ps
until PGPASSWORD=postgres psql -U postgres -h localhost -c '\l'; do
	echo 'waiting for postgres...'
	sleep 1
done
tsc
npx jest api --runInBand
docker-compose kill db
