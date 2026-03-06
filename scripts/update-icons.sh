#!/bin/bash
# Generate app icons from assets/icon/icon-1024.png
# Run from project root: ./scripts/update-icons.sh

set -e
SRC="assets/icon/icon-1024.png"
[ ! -f "$SRC" ] && { echo "Missing $SRC"; exit 1; }

# iOS AppIcon sizes (width x height)
ios_sizes="40 58 60 80 87 120 180 1024"
ios_dir="ios/Slidingblocks/Images.xcassets/AppIcon.appiconset"
mkdir -p "$ios_dir"

for size in $ios_sizes; do
  sips -z $size $size "$SRC" --out "$ios_dir/icon-${size}.png"
done

# Android mipmap sizes: mdpi=48 hdpi=72 xhdpi=96 xxhdpi=144 xxxhdpi=192
for entry in mdpi:48 hdpi:72 xhdpi:96 xxhdpi:144 xxxhdpi:192; do
  density="${entry%:*}"
  size="${entry#*:}"
  dir="android/app/src/main/res/mipmap-$density"
  mkdir -p "$dir"
  sips -z $size $size "$SRC" --out "$dir/ic_launcher.png"
  sips -z $size $size "$SRC" --out "$dir/ic_launcher_round.png"
done

echo "Icons updated. Update iOS Contents.json with filenames if needed."
