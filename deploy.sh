#!/usr/bin/env bash

WORKING_DIRECTORY="~/www/cs1531deploy"

USERNAME="thurs17cboost"
SSH_HOST="ssh-thurs17cboost.alwaysdata.net"

scp -r ./package.json ./package-lock.json ./tsconfig.json ./src "$USERNAME@$SSH_HOST:$WORKING_DIRECTORY"
ssh "$USERNAME@$SSH_HOST" "cd $WORKING_DIRECTORY && npm install --only=production"