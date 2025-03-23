#!/bin/bash

# Define directories
INPUT_DIR="./tech_logos"
OUTPUT_DIR="./tech_logos_cropped"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Iterate over images in the input directory
for image in "$INPUT_DIR"/*.{png,jpg,jpeg}; do
    # Skip if no files match
    [ -e "$image" ] || continue
    
    # Get the filename without extension
    filename=$(basename "$image")
    
    # Use ImageMagick to trim the image and save it to the output directory
    convert "$image" -trim +repage "$OUTPUT_DIR/$filename"

done

echo "Cropping complete. Saved in '$OUTPUT_DIR'"