#!/bin/bash

if [[ ! "$(wrangler whoami)" ]]; then
    echo "🚨 Not logged in to wrangler" && exit 1
fi

if [[ ! "$(git status --porcelain)" ]]; then
    git checkout main && git pull && yarn release
else
    git status --porcelain
    echo "🧹 Working directory not clean" && exit 1
fi
