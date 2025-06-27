#!/bin/bash

# Crear el directorio errorShots si no existe
if [ ! -d "./errorShots" ]; then
  echo "Creando directorio errorShots..."
  mkdir -p ./errorShots
  echo "Directorio errorShots creado correctamente."
else
  echo "El directorio errorShots ya existe."
fi

# Definir variables de entorno para controlar el comportamiento visual
export TEST_MODE=VISUAL
export TEST_SLOW_MOTION=1000 # Pausa en milisegundos entre acciones

# Ejecutar solo las pruebas de autenticación con Chrome visible
echo "Ejecutando pruebas en modo visual lento..."
npx wdio run wdio.conf.ts --spec ./test/specs/auth/authTest.e2e.ts

# Mostrar mensaje de finalización
echo "Pruebas visuales completadas."
