#!/bin/bash
cd ./js
ls=`ls -1 [A-Z]*.js */[A-Z]*.js | sed 's/\.js$//' | sed 's/\(.*\)/"\1",/'`
echo $ls | sed 's/,$//'
cd ..
grep '^%files%.*' index.html


