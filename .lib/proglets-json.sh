#!/bin/bash

OPWD=$PWD;
cd `dirname $0`/../proglets/
ls=`find . -maxdepth 1 -mindepth 1 -type d | sort | sed 's/\.\///' | sed 's/\(.*\)/"\1",/' `
echo "[`echo $ls | sed 's/,$//'`]" > ./proglets.json
cd $OPWD
