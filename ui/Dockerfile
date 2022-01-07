# Build UI
FROM node:14-alpine AS builder

RUN apk add --update python2 alpine-sdk

COPY . .

RUN npm rebuild node-sass
RUN npm install
RUN npm run build

# Main
FROM nginx

COPY --from=builder build /usr/share/nginx/html
COPY nginx /etc/nginx
RUN mkdir -p /var/logs/nginx
RUN chown nginx:nginx /var/logs/nginx
