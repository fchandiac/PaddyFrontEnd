#!/bin/zsh

# Verificar si hay Chrome instalado localmente
LOCAL_CHROME_PATHS=(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary"
  "/Applications/Chromium.app/Contents/MacOS/Chromium"
)

for chrome_path in "${LOCAL_CHROME_PATHS[@]}"; do
  if [ -f "$chrome_path" ]; then
    export CHROMIUM_PATH="$chrome_path"
    echo "Usando Chrome local: $CHROMIUM_PATH"
    break
  fi
done

# Si no se encontró Chrome local, intentar usar el del proyecto
if [ -z "$CHROMIUM_PATH" ]; then
  # Cargar variables de entorno para e2e tests
  if [ -f .env.local.e2e ]; then
    source .env.local.e2e
  fi
fi

# Si aún no tenemos Chrome, mostrar mensaje de error
if [ -z "$CHROMIUM_PATH" ] || [ ! -f "$CHROMIUM_PATH" ]; then
  echo "No se encontró un navegador Chrome válido."
  echo "Las pruebas se ejecutarán con Chrome predeterminado del sistema."
  unset CHROMIUM_PATH
fi

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
