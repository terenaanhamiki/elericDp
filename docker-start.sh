#!/bin/sh
set -e
cd /app
export HOST=0.0.0.0
export PORT=5173
export NODE_ENV=production
exec node_modules/.bin/remix-serve ./build/server/index.js
