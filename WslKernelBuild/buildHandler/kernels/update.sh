#!/usr/bin/env bash
source .env
# dotenv should contain:
# GH_USERNAME GH_TOKEN
TIME=$(LANG=C TZ=UTC date)

cd $(dirname $0)
git remote set-url origin https://$GH_USERNAME:$GH_TOKEN@github.com/lingrottin/WSL2-kernels.git
git pull
git add -A
git commit -m "Updated kernels on $TIME"
git push