#!/bin/bash -eu

if [ $# -ne 2 ]; then
    echo "Usage: ./generate_ico.sh source output"
    echo "Source image files have to be square."
    exit 1
fi

currentdir=`pwd`
tmp=`mktemp`

convert -resize 256x ${currentdir}/$1 ${tmp}
convert ${tmp} -define icon:auto-resize ${currentdir}/$2
rm -f ${tmp}
