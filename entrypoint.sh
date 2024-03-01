#!/bin/sh
set -e

if [ -z $NODE_ENV ]; then
    echo "error: NODE_ENV not set in environment"
    exit 1
fi

if [ -z $SERVICE_TOKEN ]; then
    echo "error: SERVICE_TOKEN not set in environment"
    exit 1
fi

echo $SERVICE_TOKEN | doppler configure set token --scope /
# doppler setup --token=$SERVICE_TOKEN --no-interactive

if [ $NODE_ENV == "production" ]; then
    doppler run npm run-script prod:migrate:latest
    doppler run dumb-init node dist/main.js
else
    echo "error: NODE_ENV not set to production"
    exit 1
fi
