# Main
FROM node:alpine
WORKDIR /home/app
RUN apk add --update bash
RUN apk add --update python2

# Transfer
COPY . .

# NPM
RUN npm install

# Exec
RUN chmod 100 ./entrypoint-prod.sh
ENTRYPOINT ./entrypoint-prod.sh
