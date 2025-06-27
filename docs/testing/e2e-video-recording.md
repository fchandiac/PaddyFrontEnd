# Guía para Grabar Videos de Pruebas E2E

Este documento explica cómo grabar videos de las pruebas E2E para poder visualizarlas posteriormente, documentarlas o compartirlas con el equipo.

## Opciones de grabación disponibles

Se han implementado dos métodos de grabación para adaptarse a diferentes entornos:

1. **Grabación con ffmpeg** (multiplataforma): Utiliza ffmpeg para grabar la pantalla durante las pruebas.
2. **Grabación con herramientas nativas de macOS**: Utiliza la grabadora de pantalla integrada en macOS.

## Método 1: Grabación con ffmpeg (Recomendado)

### Requisitos previos

Para grabar videos de las pruebas E2E con ffmpeg, necesitas:

1. **ffmpeg** instalado en tu sistema
   - En macOS: `brew install ffmpeg`
   - En Ubuntu/Debian: `sudo apt-get install ffmpeg`
   - En Windows: Descargar desde [ffmpeg.org](https://ffmpeg.org/download.html) o usar Chocolatey: `choco install ffmpeg`

2. **Node.js y npm** instalados

3. **Aplicación en ejecución** (en `localhost:3000`)

### Uso del script de grabación

Utiliza el script `record-e2e-tests.sh` para grabar con ffmpeg:

```bash
# Grabar todas las pruebas en modo visual normal
./record-e2e-tests.sh

# Grabar todas las pruebas en modo lento
./record-e2e-tests.sh --slow

# Grabar solo las pruebas de autenticación
./record-e2e-tests.sh --auth

# Grabar pruebas de autenticación en modo lento
./record-e2e-tests.sh -a -s
```

### Ventajas de este método

- Automatización completa (inicia y detiene la grabación automáticamente)
- Funciona en todas las plataformas (macOS, Linux, Windows con WSL)
- Genera archivos de video con nombres informativos y timestamps
- Posibilidad de personalizar parámetros de grabación

## Método 2: Grabación con herramientas nativas de macOS

Si estás en macOS y prefieres no instalar ffmpeg, puedes usar la grabadora de pantalla integrada:

### Uso del script para macOS

Utiliza el script `record-macos-e2e.sh`:

```bash
# Grabar todas las pruebas en modo visual normal
./record-macos-e2e.sh

# Grabar todas las pruebas en modo lento
./record-macos-e2e.sh --slow

# Grabar solo las pruebas de autenticación
./record-macos-e2e.sh --auth
```

### Pasos para grabar con herramientas nativas de macOS

1. Ejecuta el script `record-macos-e2e.sh`
2. Sigue las instrucciones para iniciar la grabación de pantalla con `⌘ + Shift + 5`
3. Selecciona el área a grabar y haz clic en "Grabar"
4. Después de que las pruebas terminen, detén la grabación haciendo clic en el botón de parar en la barra de menú
5. El video se guardará automáticamente en tu escritorio

### Ventajas de este método

- No requiere instalar software adicional
- Interfaz visual familiar para usuarios de macOS
- Calidad de video nativa optimizada

## Estructura de archivos generados

Los videos grabados con ffmpeg se guardan en:

- Directorio: `./test-videos/`
- Formato de nombre: `e2e_[tipo-de-prueba]_[velocidad]_[timestamp].mp4`

Las capturas de pantalla se guardan en:

- Directorio: `./errorShots/`

## Consejos para mejorar las grabaciones

1. **Usa el modo lento** (`--slow`) para que las acciones sean más visibles y el video sea más claro.

2. **Cierra otras aplicaciones** durante la grabación para evitar distracciones en el video.

3. **Ajusta la resolución de tu pantalla** antes de grabar para optimizar la calidad del video.

4. **Considera grabar solo las pruebas específicas** que necesitas documentar para mantener los videos cortos y centrados.

## Solución de problemas

### Si la grabación no funciona correctamente

1. **Problema**: El video no captura la ventana de Chrome
   - **Solución**: Asegúrate de que Chrome esté visible en tu pantalla principal

2. **Problema**: La calidad del video es baja
   - **Solución**: Si usas ffmpeg, edita el script para ajustar los parámetros, como `-crf` (menor número = mayor calidad)

3. **Problema**: El video ocupa mucho espacio
   - **Solución**: Puedes comprimir el video después usando ffmpeg:
     ```bash
     ffmpeg -i video_original.mp4 -crf 28 video_comprimido.mp4
     ```

## Compartir videos de pruebas

Los videos generados son útiles para:

1. **Documentación**: Incluirlos en wikis o documentación del proyecto
2. **Formación**: Mostrar a nuevos miembros del equipo cómo funciona la aplicación
3. **Reportes de errores**: Adjuntar a informes de error para mostrar el comportamiento exacto
4. **Revisión de código**: Compartir con otros desarrolladores durante revisiones de código o pull requests
