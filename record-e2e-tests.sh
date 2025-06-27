#!/bin/bash

# ==============================================
# Script para grabar video de pruebas E2E
# ==============================================
#
# Este script ejecuta las pruebas E2E y graba la pantalla
# mientras se ejecutan, generando un video en formato MP4.
#
# Requisitos:
# - ffmpeg instalado (brew install ffmpeg en macOS)
#
# Opciones disponibles:
# ---------------------
# -s, --slow       Ejecuta las pruebas en modo lento (pausas más largas)
# -a, --auth       Ejecuta solo las pruebas de autenticación
# -h, --help       Muestra esta ayuda
#
# Ejemplos de uso:
# ---------------
# ./record-e2e-tests.sh            # Graba todas las pruebas en modo visual normal
# ./record-e2e-tests.sh --slow     # Graba todas las pruebas en modo visual lento
# ./record-e2e-tests.sh --auth     # Graba solo las pruebas de autenticación

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

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
      echo -e "\n${YELLOW}Ejemplos:${NC}"
      echo -e "  $0                  # Graba todas las pruebas en modo visual normal"
      echo -e "  $0 --slow           # Graba todas las pruebas en modo visual lento"
      echo -e "  $0 --auth           # Graba solo las pruebas de autenticación"
      exit 0
      ;;
    *) echo "Opción desconocida: $1"; exit 1 ;;
  esac
done

# Mostrar banner
echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}    GRABACIÓN DE VIDEO DE PRUEBAS E2E${NC}"
echo -e "${GREEN}======================================================${NC}"

# Verificar si ffmpeg está instalado
if ! command -v ffmpeg &> /dev/null; then
  echo -e "${RED}ffmpeg no está instalado. Es necesario para grabar las pruebas.${NC}"
  echo -e "${YELLOW}En macOS, puedes instalarlo con: brew install ffmpeg${NC}"
  echo -e "${YELLOW}En Linux (Ubuntu/Debian): sudo apt-get install ffmpeg${NC}"
  
  # Preguntar si se desea continuar sin grabación
  read -p "¿Deseas continuar sin grabar video? (S/n): " continue_without_recording
  if [[ "$continue_without_recording" =~ ^[Nn]$ ]]; then
    echo -e "${RED}Instalación cancelada.${NC}"
    exit 1
  fi
  
  echo -e "${YELLOW}Continuando sin grabación de video...${NC}"
  VIDEO_RECORDING=0
else
  VIDEO_RECORDING=1
  echo -e "${GREEN}ffmpeg encontrado. Se grabará video de las pruebas.${NC}"
fi

# Crear el directorio errorShots si no existe
if [ ! -d "./errorShots" ]; then
  echo -e "${BLUE}Creando directorio errorShots...${NC}"
  mkdir -p ./errorShots
  echo -e "${GREEN}Directorio errorShots creado correctamente.${NC}"
else
  echo -e "${YELLOW}El directorio errorShots ya existe.${NC}"
fi

# Crear directorio para videos
if [ $VIDEO_RECORDING -eq 1 ]; then
  if [ ! -d "./test-videos" ]; then
    echo -e "${BLUE}Creando directorio para videos...${NC}"
    mkdir -p ./test-videos
    echo -e "${GREEN}Directorio test-videos creado correctamente.${NC}"
  else
    echo -e "${YELLOW}El directorio test-videos ya existe.${NC}"
  fi
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
TEST_TYPE="todas las pruebas"
if [ $AUTH_ONLY -eq 1 ]; then
  SPEC_PARAM="--spec ./test/specs/auth/authTest.e2e.ts"
  TEST_TYPE="pruebas de autenticación"
  echo -e "${YELLOW}Ejecutando solo las pruebas de autenticación${NC}"
else
  echo -e "${BLUE}Ejecutando todas las pruebas disponibles${NC}"
fi

# Verificar que la aplicación esté en ejecución
echo -e "${YELLOW}⚠️  IMPORTANTE: Asegúrate que tu aplicación Next.js esté ejecutándose en localhost:3000${NC}"
echo -e "${YELLOW}Si no está ejecutándose, abre otra terminal y ejecuta: npm run dev${NC}"
echo ""
read -p "Presiona Enter cuando la aplicación esté en ejecución..." key

# Generar nombre de archivo para el video con timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SPEED_MODE=$([ $RUN_SLOW -eq 1 ] && echo "lento" || echo "normal")
VIDEO_FILENAME="./test-videos/e2e_${TEST_TYPE// /_}_${SPEED_MODE}_${TIMESTAMP}.mp4"

# Iniciar grabación de pantalla si ffmpeg está disponible
if [ $VIDEO_RECORDING -eq 1 ]; then
  echo -e "\n${GREEN}Iniciando grabación de pantalla...${NC}"
  
  # Detectar sistema operativo para usar el comando correcto
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo -e "${BLUE}Grabando pantalla en macOS...${NC}"
    ffmpeg -f avfoundation -i "1" -r 30 -c:v libx264 -preset ultrafast -crf 18 "$VIDEO_FILENAME" &
    FFMPEG_PID=$!
  else
    # Linux (asumiendo x11grab)
    echo -e "${BLUE}Grabando pantalla en Linux...${NC}"
    ffmpeg -f x11grab -s 1920x1080 -i :0.0 -r 30 -c:v libx264 -preset ultrafast -crf 18 "$VIDEO_FILENAME" &
    FFMPEG_PID=$!
  fi
  
  # Esperar un momento para que la grabación comience
  sleep 2
  echo -e "${GREEN}Grabación iniciada. PID: $FFMPEG_PID${NC}"
fi

# Ejecutar las pruebas
echo -e "\n${GREEN}Iniciando pruebas E2E en Chrome...${NC}"
echo -e "${BLUE}(Las pruebas se ejecutarán con Chrome visible en tu pantalla)${NC}\n"

npx wdio run wdio.conf.ts $SPEC_PARAM
TEST_EXIT_CODE=$?

# Detener la grabación si está activa
if [ $VIDEO_RECORDING -eq 1 ]; then
  echo -e "\n${GREEN}Deteniendo grabación de pantalla...${NC}"
  kill -INT $FFMPEG_PID
  
  # Esperar a que termine la conversión
  wait $FFMPEG_PID
  
  echo -e "${GREEN}Grabación completada: $VIDEO_FILENAME${NC}"
fi

# Verificar el resultado
if [ $TEST_EXIT_CODE -eq 0 ]; then
  echo -e "\n${GREEN}✅ ¡Pruebas completadas con éxito!${NC}"
else
  echo -e "\n${RED}❌ Algunas pruebas fallaron. Revisa los errores anteriores y las capturas en ./errorShots/${NC}"
fi

# Mostrar ubicación de las capturas de pantalla y video
echo -e "\n${BLUE}Las capturas de pantalla de las pruebas están disponibles en:${NC}"
echo -e "${YELLOW}$(pwd)/errorShots/${NC}"

if [ $VIDEO_RECORDING -eq 1 ]; then
  echo -e "\n${BLUE}El video de las pruebas está disponible en:${NC}"
  echo -e "${YELLOW}$(pwd)/$VIDEO_FILENAME${NC}"
  
  # Mostrar duración del video
  duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VIDEO_FILENAME")
  minutes=$(printf "%.0f" $(echo "$duration/60" | bc -l))
  seconds=$(printf "%.0f" $(echo "$duration%60" | bc -l))
  echo -e "${BLUE}Duración del video: ${minutes} minutos y ${seconds} segundos${NC}"
  
  # Preguntar si se desea abrir el video
  read -p "¿Deseas abrir el video ahora? (S/n): " open_video
  if [[ ! "$open_video" =~ ^[Nn]$ ]]; then
    echo -e "${GREEN}Abriendo video...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
      open "$VIDEO_FILENAME"
    else
      xdg-open "$VIDEO_FILENAME"
    fi
  fi
fi

echo -e "\n${GREEN}¡Proceso completado!${NC}"
