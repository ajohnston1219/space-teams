#!/bin/bash

if [ -z "$1" ]; then
	echo "usage: make-service <service-name>"
	exit 1
fi

SERVICE_NAME="$1"

if [[ -f "$SERVICE_NAME" ]]; then
	echo "file with name $SERVICE_NAME already exists"
	exit 1
fi

if [[ -d "$SERVICE_NAME" ]]; then
	echo "directory with name $SERVICE_NAME already exists"
	exit 1
fi

echo "Creating service ${SERVICE_NAME}..."

mkdir $SERVICE_NAME
cd $SERVICE_NAME
npm init
npm i -D typescript jest sinon ts-jest ts-node @types/jest @types/sinon @pact-foundation/pact
tsc --init

mkdir src
mkdir src/model
mkdir src/service
mkdir src/test
