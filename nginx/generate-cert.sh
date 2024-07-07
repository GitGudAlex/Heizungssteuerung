#!/bin/bash

# Create the ssl directory if it does not exist
mkdir -p ssl

# Generate a self-signed SSL certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/server.cert_key -out ssl/server.crt -subj "/CN=localhost"

echo "Self-signed SSL certificate and key have been generated in the ssl directory."