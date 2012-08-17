cd ./js
ls=`ls -1 [A-Z]*.js */[A-Z]*.js | sed 's/[\/]*\///' | sed 's/\.js$//' | sed 's/\(.*\)/"\1",/'`
echo $ls | sed 's/,$//'



