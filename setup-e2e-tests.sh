#!/bin/zsh
# Este script obtiene un usuario válido de la base de datos para tests e2e

# Colores para la salida
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "${YELLOW}Obteniendo usuario de prueba para tests e2e...${NC}"

# Asegurarse de que la aplicación esté corriendo
if ! curl -s http://localhost:3000 > /dev/null; then
  echo "${RED}Error: La aplicación no parece estar corriendo en localhost:3000${NC}"
  echo "Por favor, inicia la aplicación con 'npm run dev' antes de ejecutar este script."
  exit 1
fi

# Generar archivo de credenciales con datos ficticios
# Nota: Debes reemplazar estos con credenciales reales para tu entorno
cat > ./test/data/credentials.ts << EOL
// Datos de prueba para autenticación
// Generado automáticamente por setup-e2e-tests.sh
export const TEST_CREDENTIALS = {
  email: 'admin@example.com',  // Reemplazar con credenciales reales
  password: 'adminpassword'   // Reemplazar con credenciales reales
};
EOL

echo "${GREEN}Archivo de credenciales generado en ./test/data/credentials.ts${NC}"
echo "${YELLOW}IMPORTANTE: Edita el archivo con credenciales reales antes de ejecutar los tests.${NC}"
echo ""
echo "Para ejecutar los tests de autenticación:"
echo "  ./run-e2e-tests.sh auth"
echo ""
echo "Para ejecutar los tests de la página de recepción:"
echo "  ./run-e2e-tests.sh reception"
echo ""
echo "Para ejecutar todos los tests:"
echo "  ./run-e2e-tests.sh"
