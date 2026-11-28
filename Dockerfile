# One image carries both sites: the user site (dist/, port 80) and the admin site
# (dist-admin/, port 8080). docker build -t jobbeacon-fe .
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build && npm run build:admin

# Pinned: 1.31.9 fixes the November 2026 advisories, including CVE-2026-123634 (resolver + variable in proxy_pass,
# the pattern nginx.conf uses). Bump it when nginx.org publishes a new security advisory.
FROM nginx:1.31.9-alpine

RUN apk add --no-cache gettext

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-common.conf /etc/nginx/common.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/dist-admin /usr/share/nginx/admin
COPY env.template.js /etc/jobbeacon/env.template.js
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
