# Script para grabar pruebas E2E en Windows
# Guardar este archivo como record-windows-e2e.ps1

# Colores para mensajes
$green = "Green"
$yellow = "Yellow"
$blue = "Cyan"
$red = "Red"

# Función para mostrar mensajes con color
function Write-ColorMessage {
    param (
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Mostrar banner
Write-ColorMessage "======================================================" $green
Write-ColorMessage "    GRABACIÓN DE VIDEO DE PRUEBAS E2E EN WINDOWS" $green
Write-ColorMessage "======================================================" $green

# Comprobar si tenemos los parámetros
$runSlow = $false
$authOnly = $false

# Procesar parámetros
foreach ($arg in $args) {
    if ($arg -eq "-s" -or $arg -eq "--slow") {
        $runSlow = $true
    }
    elseif ($arg -eq "-a" -or $arg -eq "--auth") {
        $authOnly = $true
    }
    elseif ($arg -eq "-h" -or $arg -eq "--help") {
        Write-ColorMessage "Uso: .\record-windows-e2e.ps1 [opciones]" $blue
        Write-ColorMessage "Opciones:" $yellow
        Write-ColorMessage "  -s, --slow       Ejecuta las pruebas en modo lento (pausas más largas)" "White"
        Write-ColorMessage "  -a, --auth       Ejecuta solo las pruebas de autenticación" "White"
        Write-ColorMessage "  -h, --help       Muestra esta ayuda" "White"
        exit
    }
}

# Crear directorio errorShots si no existe
if (-not (Test-Path -Path ".\errorShots")) {
    Write-ColorMessage "Creando directorio errorShots..." $blue
    New-Item -ItemType Directory -Path ".\errorShots" | Out-Null
    Write-ColorMessage "Directorio errorShots creado correctamente." $green
}
else {
    Write-ColorMessage "El directorio errorShots ya existe." $yellow
}

# Configurar variables de entorno
$env:TEST_MODE = "VISUAL"

# Configurar pausas según el modo
if ($runSlow) {
    $env:TEST_SLOW_MOTION = "1000"
    Write-ColorMessage "Modo lento activado - Se añadirán pausas entre acciones" $yellow
}
else {
    $env:TEST_SLOW_MOTION = "200"
    Write-ColorMessage "Modo normal - Pausas mínimas entre acciones" $blue
}

# Determinar qué pruebas ejecutar
$specParam = ""
if ($authOnly) {
    $specParam = "--spec ./test/specs/auth/authTest.e2e.ts"
    Write-ColorMessage "Ejecutando solo las pruebas de autenticación" $yellow
}
else {
    Write-ColorMessage "Ejecutando todas las pruebas disponibles" $blue
}

# Verificar que la aplicación esté en ejecución
Write-ColorMessage "⚠️  IMPORTANTE: Asegúrate que tu aplicación Next.js esté ejecutándose en localhost:3000" $yellow
Write-ColorMessage "Si no está ejecutándose, abre otra terminal y ejecuta: npm run dev" $yellow
Write-Host ""
Write-Host "Presiona Enter cuando la aplicación esté en ejecución..." -NoNewline
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Write-Host ""

# Instrucciones para iniciar la grabación
Write-ColorMessage "======================================================" $green
Write-ColorMessage "INSTRUCCIONES PARA GRABAR LA PANTALLA EN WINDOWS:" $green
Write-ColorMessage "======================================================" $green
Write-ColorMessage "1. Presiona Win + G para abrir la barra de juegos de Windows" $yellow
Write-ColorMessage "2. Haz clic en el botón de grabación para iniciar la captura" $yellow
Write-ColorMessage "3. O utiliza el atajo Win + Alt + R para iniciar/detener la grabación" $yellow
Write-ColorMessage "4. Cuando las pruebas terminen, detén la grabación con el mismo atajo" $yellow
Write-ColorMessage "5. El video se guardará en tu carpeta Videos/Captures" $yellow
Write-ColorMessage "======================================================" $green

# Esperar a que el usuario inicie la grabación
Write-Host "Presiona Enter después de iniciar la grabación..." -NoNewline
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Write-Host ""

# Ejecutar las pruebas
Write-ColorMessage "Iniciando pruebas E2E en Chrome..." $green
Write-ColorMessage "(Las pruebas se ejecutarán con Chrome visible en tu pantalla)" $blue
Write-Host ""

# Ejecutar las pruebas
npx wdio run wdio.conf.ts $specParam

# Mostrar instrucciones finales
Write-ColorMessage "======================================================" $green
Write-ColorMessage "¡PRUEBAS COMPLETADAS!" $green
Write-ColorMessage "======================================================" $green
Write-ColorMessage "Recuerda detener la grabación con Win + Alt + R." $yellow
Write-ColorMessage "El video se guardará en tu carpeta Videos/Captures." $yellow
Write-ColorMessage "======================================================" $green

# Mostrar ruta probable del video
$capturesPath = [System.IO.Path]::Combine($env:USERPROFILE, "Videos", "Captures")
Write-ColorMessage "Ruta probable de los videos:" $blue
Write-ColorMessage $capturesPath $yellow
