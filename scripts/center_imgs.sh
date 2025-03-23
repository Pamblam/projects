#!/bin/bash

# Directories
INPUT_DIR="./tech_logos"
OUTPUT_DIR="./centered"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Iterate over images
for image in "$INPUT_DIR"/*.{png,jpg,jpeg}; do
    # Skip if no files match
    [ -e "$image" ] || continue

    # Get filename without extension
    filename=$(basename "$image")
    filename_no_ext="${filename%.*}"

    # Get image dimensions
    dimensions=$(identify -format "%w %h" "$image")
    width=$(echo $dimensions | cut -d' ' -f1)
    height=$(echo $dimensions | cut -d' ' -f2)

    # Determine new canvas size (max of width or height)
    if [ "$width" -gt "$height" ]; then
        new_size=$width
    else
        new_size=$height
    fi

    # Create new squared image with transparent background and center the original image
    convert "$image" -gravity center -background none -extent ${new_size}x${new_size} "$OUTPUT_DIR/${filename_no_ext}.png"

done

echo "Centering complete. Saved in '$OUTPUT_DIR'"