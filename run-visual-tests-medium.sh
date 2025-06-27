#!/bin/bash

# ==============================================
# Script para ejecutar pruebas E2E en modo visual intermedio
# ==============================================
#
# Este script configura y ejecuta las pruebas E2E de WebdriverIO en
# modo visual intermedio, con pausas moderadas entre acciones (500ms)
# para una mejor visualización sin ser demasiado lento.

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Mostrar banner
echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}  EJECUCIÓN DE PRUEBAS E2E EN MODO VISUAL INTERMEDIO  ${NC}"
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
export TEST_SLOW_MOTION=500

echo -e "${YELLOW}Modo intermedio activado - Pausas moderadas entre acciones (500ms)${NC}"

# Determinar si ejecutar solo pruebas de autenticación
if [ "$1" == "--auth" ] || [ "$1" == "-a" ]; then
  SPEC_PARAM="--spec ./test/specs/auth/authTest.e2e.ts"
  echo -e "${YELLOW}Ejecutando solo las pruebas de autenticación${NC}"
else
  SPEC_PARAM=""
  echo -e "${BLUE}Ejecutando todas las pruebas disponibles${NC}"
fi

# Verificar que la aplicación esté en ejecución
echo -e "${YELLOW}⚠️  IMPORTANTE: Asegúrate que tu aplicación Next.js esté ejecutándose en localhost:3000${NC}"
echo -e "${YELLOW}Si no está ejecutándose, abre otra terminal y ejecuta: npm run dev${NC}"
echo ""
read -p "Presiona Enter cuando la aplicación esté en ejecución..." key

# Ejecutar las pruebas
echo -e "\n${GREEN}Iniciando pruebas E2E en Chrome con velocidad intermedia...${NC}"
echo -e "${BLUE}(Las pruebas se ejecutarán con Chrome visible en tu pantalla)${NC}\n"

npx wdio run wdio.conf.ts $SPEC_PARAM

# Verificar el resultado
if [ $? -eq 0 ]; then
  echo -e "\n${GREEN}✅ ¡Pruebas completadas con éxito!${NC}"
else
  echo -e "\n${RED}❌ Algunas pruebas fallaron. Revisa los errores anteriores y las capturas en ./errorShots/${NC}"
fi

# Mostrar ubicación de las capturas de pantalla
echo -e "\n${BLUE}Las capturas de pantalla de las pruebas están disponibles en:${NC}"
echo -e "${YELLOW}$(pwd)/errorShots/${NC}\n"
