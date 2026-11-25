#!/bin/sh
set -eu

# Both the user site (html/) and the admin site (admin/) read the same window.__ENV__ shape;
# each app only uses the keys it needs.
for root in /usr/share/nginx/html /usr/share/nginx/admin; do
  envsubst '$VITE_API_BASE_URL $VITE_FIREBASE_API_KEY $VITE_FIREBASE_AUTH_DOMAIN $VITE_FIREBASE_PROJECT_ID $VITE_FIREBASE_STORAGE_BUCKET $VITE_FIREBASE_MESSAGING_SENDER_ID $VITE_FIREBASE_APP_ID $VITE_USER_SITE_URL $VITE_GRAFANA_URL' \
    < /etc/jobbeacon/env.template.js \
    > "$root/env.js"
done

exec nginx -g 'daemon off;'
