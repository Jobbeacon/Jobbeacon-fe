#!/bin/sh
set -eu

envsubst '$VITE_API_BASE_URL $VITE_FIREBASE_API_KEY $VITE_FIREBASE_AUTH_DOMAIN $VITE_FIREBASE_PROJECT_ID $VITE_FIREBASE_STORAGE_BUCKET $VITE_FIREBASE_MESSAGING_SENDER_ID $VITE_FIREBASE_APP_ID $VITE_USER_SITE_URL' \
  < /etc/jobbeacon/env.template.js \
  > /usr/share/nginx/html/env.js

exec nginx -g 'daemon off;'
