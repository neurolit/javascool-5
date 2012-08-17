#!/bin/bash
cd ./js
ls=`ls */*.js *.js | grep '^[A-Zm]' | sed 's/\//./' | sed 's/\.js$//' | sed 's/\(.*\)/"\1",/'`
ls=`echo $ls | sed 's/,$//'`

cp ../index.html ../index.html~ ; sed "s/.*\/\*%files%\*\/.*/\/*%files%*\/ `echo $ls | sed 's/\"/\\\\\"/g'`/" < ../index.html~ > ../index.html

grep %files% ../index.html
