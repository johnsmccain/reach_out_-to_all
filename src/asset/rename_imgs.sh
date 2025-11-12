#!/bin/bash

# Counter starts at 1
count=1

# Loop through all matching files
for file in IMG-20251104-WA*.jpg; do
  # Skip if no files match
  [ -e "$file" ] || continue

  # Construct new filename
  new_name="img-${count}.jpg"

  # Rename file
  mv "$file" "$new_name"

  echo "Renamed: $file → $new_name"

  # Increment counter
  ((count++))
done
