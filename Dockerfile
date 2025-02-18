FROM node:20.12.2-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile  # Use npm ci for faster, reliable installs

COPY . .
RUN npm run build

# Use Nginx as the final production image
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /usr/src/app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the env-config.js template for runtime variable injection
COPY public/env-config.js.template /usr/share/nginx/html/env-config.js.template

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Inject environment variables dynamically into env-config.js and start Nginx
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js && exec nginx -g 'daemon off;'"]
