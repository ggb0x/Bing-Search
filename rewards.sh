#!/bin/bash

echo "Running Bing Search automation script..."

echo "Generating search terms..."
python3 generate_terms.py
if [ $? -ne 0 ]; then
    echo "Error generating search terms."
    exit 1
fi

echo "Starting search..."
node index.js
if [ $? -ne 0 ]; then
    echo "Error running the search script."
    exit 1
fi

echo "Script finished successfully."