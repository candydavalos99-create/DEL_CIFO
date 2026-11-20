#!/bin/sh
# Lo ejecuta Render al construir el sitio estático (Build Command: sh generar-config.sh).
# Reescribe config.js con la dirección pública del backend (variable de entorno API_URL).
set -e
if [ -z "$API_URL" ]; then
  echo "ERROR: falta la variable de entorno API_URL (la URL del backend en Render)."
  exit 1
fi
URL="${API_URL%/}"   # quita la barra final si la hay
echo "window.API_URL = '$URL';" > config.js
echo "config.js generado → $URL"
