#!/bin/zsh

# Colores para la salida
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directorio donde se guardará Chromium
CHROMIUM_DIR="./browser"
CHROMIUM_MAC_PATH="$CHROMIUM_DIR/chrome-mac/Chromium.app/Contents/MacOS/Chromium"

# URL de descarga para Chromium (versión 114 - estable y compatible con la mayoría de ChromeDrivers)
# Puedes encontrar otras versiones en: https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html
CHROMIUM_MAC_URL="https://commondatastorage.googleapis.com/chromium-browser-snapshots/Mac/1002910/chrome-mac.zip"

echo "${YELLOW}Configurando Chromium para pruebas e2e...${NC}"

# Verificar si ya tenemos Chromium instalado
if [ -f "$CHROMIUM_MAC_PATH" ]; then
  echo "${GREEN}Chromium ya está instalado en el proyecto.${NC}"
else
  echo "Descargando e instalando Chromium específico para pruebas..."
  
  # Crear directorio si no existe
  mkdir -p "$CHROMIUM_DIR"
  
  # Descargar Chromium
  echo "Descargando Chromium desde: $CHROMIUM_MAC_URL"
  # Usar opciones de curl para mayor fiabilidad
  curl -L "$CHROMIUM_MAC_URL" -o "$CHROMIUM_DIR/chrome-mac.zip" --retry 3 --retry-delay 5 -C -
  
  # Verificar que la descarga fue exitosa
  if [ ! -s "$CHROMIUM_DIR/chrome-mac.zip" ]; then
    echo "${RED}Error: La descarga de Chromium falló. Archivo vacío o corrupto.${NC}"
    echo "Intentando descarga alternativa..."
    
    # URL alternativa (versión más reciente pero estable)
    CHROMIUM_ALT_URL="https://commondatastorage.googleapis.com/chromium-browser-snapshots/Mac/1083542/chrome-mac.zip"
    echo "Descargando desde: $CHROMIUM_ALT_URL"
    curl -L "$CHROMIUM_ALT_URL" -o "$CHROMIUM_DIR/chrome-mac.zip" --retry 3 --retry-delay 5 -C -
    
    if [ ! -s "$CHROMIUM_DIR/chrome-mac.zip" ]; then
      echo "${RED}Error: Ambas descargas fallaron. Intenta ejecutar el script nuevamente o descarga manualmente Chromium.${NC}"
      exit 1
    fi
  fi
  
  # Descomprimir
  echo "Descomprimiendo Chromium..."
  unzip -q "$CHROMIUM_DIR/chrome-mac.zip" -d "$CHROMIUM_DIR"
  
  # Eliminar el archivo zip
  rm "$CHROMIUM_DIR/chrome-mac.zip"
  
  # Verificar que se descargó correctamente
  if [ -f "$CHROMIUM_MAC_PATH" ]; then
    echo "${GREEN}Chromium instalado correctamente.${NC}"
  else
    echo "${RED}Error: No se pudo instalar Chromium.${NC}"
    exit 1
  fi
fi

# Verificar versión de Chromium
echo "Versión de Chromium instalada:"
"$CHROMIUM_MAC_PATH" --version

# Crear/actualizar archivo .env.local con la ruta a Chromium
echo "Actualizando variables de entorno para WebdriverIO..."
echo "CHROMIUM_PATH=$CHROMIUM_MAC_PATH" > .env.local.e2e

echo "${GREEN}Configuración completada.${NC}"
echo ""
echo "Para ejecutar los tests con este Chromium específico:"
echo "  CHROMIUM_PATH=\"$CHROMIUM_MAC_PATH\" ./run-e2e-tests.sh"
echo ""
echo "O simplemente:"
echo "  ./run-e2e-tests-with-chromium.sh"
