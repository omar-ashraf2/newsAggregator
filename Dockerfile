FROM node:20.12.2-alpine as build
WORKDIR /usr/src/app
  
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile
  
COPY . .
  
COPY .env .env
  
RUN npm run build
 
RUN sed -i 's|<body>|<body>\n    <script src=\"/env-config.js\"></script>|g' dist/index.html
  
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
  
COPY --from=build /usr/src/app/dist ./
  
COPY nginx.conf /etc/nginx/conf.d/default.conf
  
COPY public/env-config.js.template ./env-config.js.template
  
COPY .env .env
  
RUN apk add --no-cache gettext
  
CMD ["/bin/sh", "-c", "export $(cat .env | xargs) && envsubst < env-config.js.template > env-config.js && exec nginx -g 'daemon off;'"]
  