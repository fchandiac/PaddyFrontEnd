#!/bin/bash

# ==============================================
# Script para ejecutar pruebas E2E en modo visual
# ==============================================
#
# Este script configura y ejecuta las pruebas E2E de WebdriverIO en
# modo visual, lo que permite ver Chrome ejecutando las pruebas en
# tiempo real con movimientos más lentos y pausas para mejor visualización.
#
# Opciones disponibles:
# ---------------------
# -s, --slow       Ejecuta las pruebas en modo lento (pausas más largas)
# -m, --medium     Ejecuta las pruebas en modo intermedio (pausas moderadas)
# -a, --auth       Ejecuta solo las pruebas de autenticación
# -h, --help       Muestra esta ayuda
#
# Ejemplos de uso:
# ---------------
# ./run-visual-e2e.sh            # Ejecuta todas las pruebas en modo visual normal
# ./run-visual-e2e.sh --medium   # Ejecuta todas las pruebas en modo visual intermedio
# ./run-visual-e2e.sh --slow     # Ejecuta todas las pruebas en modo visual lento
# ./run-visual-e2e.sh --auth     # Ejecuta solo las pruebas de autenticación
# ./run-visual-e2e.sh -a -m      # Ejecuta las pruebas de autenticación en modo intermedio

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuración predeterminada
RUN_SLOW=0
RUN_MEDIUM=0
AUTH_ONLY=0

# Procesar argumentos
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -s|--slow) RUN_SLOW=1; RUN_MEDIUM=0; shift ;;
    -m|--medium) RUN_MEDIUM=1; RUN_SLOW=0; shift ;;
    -a|--auth) AUTH_ONLY=1; shift ;;
    -h|--help)
      echo -e "${BLUE}Uso: $0 [opciones]${NC}"
      echo -e "${YELLOW}Opciones:${NC}"
      echo -e "  -s, --slow       Ejecuta las pruebas en modo lento (pausas más largas)"
      echo -e "  -m, --medium     Ejecuta las pruebas en modo intermedio (pausas moderadas)"
      echo -e "  -a, --auth       Ejecuta solo las pruebas de autenticación"
      echo -e "  -h, --help       Muestra esta ayuda"
      echo -e "\n${YELLOW}Ejemplos:${NC}"
      echo -e "  $0                  # Ejecuta todas las pruebas en modo visual normal"
      echo -e "  $0 --medium         # Ejecuta todas las pruebas en modo visual intermedio"
      echo -e "  $0 --slow           # Ejecuta todas las pruebas en modo visual lento"
      echo -e "  $0 --auth           # Ejecuta solo las pruebas de autenticación"
      echo -e "  $0 -a -m            # Ejecuta las pruebas de autenticación en modo intermedio"
      exit 0
      ;;
    *) echo "Opción desconocida: $1"; exit 1 ;;
  esac
done

# Mostrar banner
echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}    EJECUCIÓN DE PRUEBAS E2E EN MODO VISUAL${NC}"
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
  echo -e "${YELLOW}Modo lento activado - Se añadirán pausas largas entre acciones (1000ms)${NC}"
elif [ $RUN_MEDIUM -eq 1 ]; then
  export TEST_SLOW_MOTION=500
  echo -e "${YELLOW}Modo intermedio activado - Se añadirán pausas moderadas entre acciones (500ms)${NC}"
else
  export TEST_SLOW_MOTION=200
  echo -e "${BLUE}Modo normal - Pausas mínimas entre acciones (200ms)${NC}"
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

# Ejecutar las pruebas
echo -e "\n${GREEN}Iniciando pruebas E2E en Chrome...${NC}"
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
