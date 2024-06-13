#!/bin/bash

# Convert PNGs to WebP using ffmpeg
for png_file in icons/*.png; do
    if [ -f "$png_file" ]; then
        filename=$(basename -- "$png_file")
        extension="${filename##*.}"
        filename_noext="${filename%.*}"
        webp_output="newicons/${filename_noext}.webp"

        ffmpeg -i "$png_file" -q:v 80 -compression_level 6 "$webp_output"
    fi
done
