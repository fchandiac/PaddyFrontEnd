#!/bin/bash

# ==============================================
# Script para grabar video de pruebas E2E en macOS
# ==============================================
#
# Este script utiliza la grabación de pantalla integrada en macOS
# para grabar las pruebas E2E sin necesidad de instalar ffmpeg.
#
# Opciones disponibles:
# ---------------------
# -s, --slow       Ejecuta las pruebas en modo lento (pausas más largas)
# -a, --auth       Ejecuta solo las pruebas de autenticación
# -h, --help       Muestra esta ayuda
#

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar que estamos en macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
  echo -e "${RED}Este script solo funciona en macOS. Para otros sistemas, usa ./record-e2e-tests.sh${NC}"
  exit 1
fi

# Configuración predeterminada
RUN_SLOW=0
AUTH_ONLY=0

# Procesar argumentos
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -s|--slow) RUN_SLOW=1; shift ;;
    -a|--auth) AUTH_ONLY=1; shift ;;
    -h|--help)
      echo -e "${BLUE}Uso: $0 [opciones]${NC}"
      echo -e "${YELLOW}Opciones:${NC}"
      echo -e "  -s, --slow       Ejecuta las pruebas en modo lento (pausas más largas)"
      echo -e "  -a, --auth       Ejecuta solo las pruebas de autenticación"
      echo -e "  -h, --help       Muestra esta ayuda"
      exit 0
      ;;
    *) echo "Opción desconocida: $1"; exit 1 ;;
  esac
done

# Mostrar banner
echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}    GRABACIÓN DE VIDEO DE PRUEBAS E2E EN MACOS${NC}"
echo -e "${GREEN}======================================================${NC}"

# Crear el directorio errorShots si no existe
if [ ! -d "./errorShots" ]; then
  echo -e "${BLUE}Creando directorio errorShots...${NC}"
  mkdir -p ./errorShots
  echo -e "${GREEN}Directorio errorShots creado correctamente.${NC}"
else
  echo -e "${YELLOW}El directorio errorShots ya existe.${NC}"
fi

# Definir variables de entorno para controlar el comportamiento visual
export TEST_MODE=VISUAL

# Configurar pausas según el modo
if [ $RUN_SLOW -eq 1 ]; then
  export TEST_SLOW_MOTION=1000
  echo -e "${YELLOW}Modo lento activado - Se añadirán pausas entre acciones${NC}"
else
  export TEST_SLOW_MOTION=200
  echo -e "${BLUE}Modo normal - Pausas mínimas entre acciones${NC}"
fi

# Determinar qué pruebas ejecutar
SPEC_PARAM=""
if [ $AUTH_ONLY -eq 1 ]; then
  SPEC_PARAM="--spec ./test/specs/auth/authTest.e2e.ts"
  echo -e "${YELLOW}Ejecutando solo las pruebas de autenticación${NC}"
else
  echo -e "${BLUE}Ejecutando todas las pruebas disponibles${NC}"
fi

# Verificar que la aplicación esté en ejecución
echo -e "${YELLOW}⚠️  IMPORTANTE: Asegúrate que tu aplicación Next.js esté ejecutándose en localhost:3000${NC}"
echo -e "${YELLOW}Si no está ejecutándose, abre otra terminal y ejecuta: npm run dev${NC}"
echo ""
read -p "Presiona Enter cuando la aplicación esté en ejecución..." key

# Instrucciones para iniciar la grabación
echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}INSTRUCCIONES PARA GRABAR LA PANTALLA EN MACOS:${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "${YELLOW}1. Presiona ${NC}${RED}⌘ + Shift + 5${NC}${YELLOW} para abrir la herramienta de grabación${NC}"
echo -e "${YELLOW}2. Selecciona la opción 'Grabar pantalla completa' o 'Grabar parte seleccionada'${NC}"
echo -e "${YELLOW}3. Haz clic en 'Grabar' para iniciar la grabación${NC}"
echo -e "${YELLOW}4. Cuando las pruebas terminen, haz clic en el botón de parar en la barra de menú${NC}"
echo -e "${YELLOW}5. El video se guardará automáticamente en tu escritorio${NC}"
echo -e "${GREEN}======================================================${NC}"

# Esperar a que el usuario inicie la grabación
read -p "Presiona Enter después de iniciar la grabación..." key

# Ejecutar las pruebas
echo -e "\n${GREEN}Iniciando pruebas E2E en Chrome...${NC}"
echo -e "${BLUE}(Las pruebas se ejecutarán con Chrome visible en tu pantalla)${NC}\n"

npx wdio run wdio.conf.ts $SPEC_PARAM

# Mostrar instrucciones finales
echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}¡PRUEBAS COMPLETADAS!${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "${YELLOW}Recuerda detener la grabación haciendo clic en el botón de parar en la barra de menú.${NC}"
echo -e "${YELLOW}El video se guardará automáticamente en tu escritorio.${NC}"
echo -e "${GREEN}======================================================${NC}"
