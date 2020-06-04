#!/bin/sh

input=../js/tridchessboard.js
min=../build/tridchessboard.min.js
module=../build/tridchessboard.module.js

cd $(dirname $0)

directory=$(dirname $input)

# Generate min.js
echo "Generating min.js"
grep "^// import '*'" $input | awk -F\' -v input="$input" '{print $2} END{print input}' | sed "s+^\./+$directory/+" | xargs cat > $min

# Generate module.js
echo "Generating module.js"
cp -f $min $module
echo "export { Tridchessboard };" >> $module
