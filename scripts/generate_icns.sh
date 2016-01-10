#!/bin/bash -eu

if [ $# -ne 2 ]; then
    echo "Usage: ./generate_icns.sh source output"
    echo "Source image files have to be square."
    exit 1
fi

currentdir=`pwd`
workdir=`mktemp -d`

cd $workdir
mkdir ${workdir}/Giraf.iconset
convert -resize 1024x ${currentdir}/$1 ${workdir}/Giraf.iconset/icon_512x512@2x.png
convert -resize  512x ${currentdir}/$1 ${workdir}/Giraf.iconset/icon_512x512.png
convert -resize  512x ${currentdir}/$1 ${workdir}/Giraf.iconset/icon_256x256@2x.png
convert -resize  256x ${currentdir}/$1 ${workdir}/Giraf.iconset/icon_256x256.png
convert -resize  256x ${currentdir}/$1 ${workdir}/Giraf.iconset/icon_128x128@2x.png
convert -resize  128x ${currentdir}/$1 ${workdir}/Giraf.iconset/icon_128x128.png
convert -resize   64x ${currentdir}/$1 ${workdir}/Giraf.iconset/icon_32x32@2x.png
convert -resize   32x ${currentdir}/$1 ${workdir}/Giraf.iconset/icon_32x32.png
convert -resize   32x ${currentdir}/$1 ${workdir}/Giraf.iconset/icon_16x16@2x.png
convert -resize   16x ${currentdir}/$1 ${workdir}/Giraf.iconset/icon_16x16.png
iconutil --convert icns --output ${currentdir}/$2 ${workdir}/Giraf.iconset
rm -rf ${workdir}
