#!/bin/bash

# Crear el directorio errorShots si no existe
if [ ! -d "./errorShots" ]; then
  echo "Creando directorio errorShots..."
  mkdir -p ./errorShots
  echo "Directorio errorShots creado correctamente."
else
  echo "El directorio errorShots ya existe."
fi

# Ejecutar solo las pruebas de autenticación con Chrome visible
echo "Ejecutando pruebas en modo visual..."
npx wdio run wdio.conf.ts --spec ./test/specs/auth/authTest.e2e.ts

# Mostrar mensaje de finalización
echo "Pruebas visuales completadas."
