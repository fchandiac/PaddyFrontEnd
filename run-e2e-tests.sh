#!/bin/zsh

# Crear directorio para capturas de pantalla de errores si no existe
mkdir -p errorShots

# Establecer NODE_OPTIONS para aumentar la memoria disponible
export NODE_OPTIONS="--max-old-space-size=4096"

# Verificar si se pasó un argumento específico
if [ "$1" = "auth" ]; then
  # Ejecutar solo test de autenticación
  echo "Ejecutando test de autenticación..."
  npx wdio run wdio.conf.js --spec ./test/specs/authTest.e2e.ts
elif [ "$1" = "reception" ]; then
  # Ejecutar tests para la página de recepción nueva
  echo "Ejecutando tests para la página de recepción nueva..."
  npx wdio run wdio.conf.js --spec ./test/specs/newReceptionPage.e2e.ts
else
  # Ejecutar todos los tests
  echo "Ejecutando todos los tests..."
  npx wdio run wdio.conf.js
fi

# Finalizar script
echo "Pruebas completadas."
