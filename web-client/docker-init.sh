#!/bin/bash -e
docker build -t web-client-build -f ../Dockerfile ..
docker run --rm web-client-build /bin/sh -c 'echo "init completed"'