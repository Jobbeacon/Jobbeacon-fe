# APP_TARGET=user  -> site người dùng (mặc định)
# APP_TARGET=admin -> trang quản trị
# Ví dụ: docker build --build-arg APP_TARGET=admin -t jobbeacon-admin .
ARG APP_TARGET=user

FROM node:22-alpine AS build
ARG APP_TARGET

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN if [ "$APP_TARGET" = "admin" ]; then \
      npm run build:admin && mv dist-admin /app/out; \
    else \
      npm run build && mv dist /app/out; \
    fi


# Pinned: 1.31.9 fixes the November 2026 advisories, including CVE-2026-123634 (resolver + variable in proxy_pass,
# the pattern nginx.conf uses). Bump it when nginx.org publishes a new security advisory.
FROM nginx:1.31.9-alpine

RUN apk add --no-cache gettext

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html
COPY env.template.js /etc/jobbeacon/env.template.js
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
