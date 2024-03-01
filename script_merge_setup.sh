#!/bin/sh

apk add gettext

APPVERSION=$(echo $BITBUCKET_COMMIT | head -c 7)-$(date +"%Y-%m-%dT%H:%M:%S")-${ENVIRONMENT}
echo $APPVERSION > VERSION.txt
docker build -t $CONTAINER_REGISTRY_NAME -f Dockerfile .
envsubst <task-definition.sample.json >task-definition.json
docker tag $CONTAINER_REGISTRY_NAME:latest $CONTAINER_REGISTRY_NAME:$CONTAINER_REGISTRY_TAG-$(echo $BITBUCKET_COMMIT | head -c 7)
# docker tag $CONTAINER_REGISTRY_NAME:latest $CONTAINER_REGISTRY_URL:$CONTAINER_REGISTRY_TAG-$(echo $BITBUCKET_COMMIT | head -c 7)
