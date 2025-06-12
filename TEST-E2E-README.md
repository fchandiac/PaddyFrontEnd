# Tests End-to-End con WebdriverIO

Este documento describe cómo ejecutar y solucionar problemas en los tests end-to-end de la aplicación usando WebdriverIO.

## Requisitos previos

1. **Aplicación en ejecución**: Asegúrate de que la aplicación Next.js esté corriendo en `localhost:3000`.
2. **Credenciales configuradas**: Asegúrate de que las credenciales de prueba estén configuradas correctamente.

## Ejecutar los tests

### Método recomendado (con Chromium estable)
Para evitar problemas de compatibilidad y cierres inesperados de Chrome, usa:

```bash
# Primero configura Chromium (solo necesitas hacer esto una vez)
./setup-chromium.sh

# Luego ejecuta los tests con este Chromium
./run-e2e-tests-with-chromium.sh
```

Este método descarga una versión específica y estable de Chromium directamente en el proyecto, evitando incompatibilidades con versiones locales de Chrome o ChromeDriver.

### Método alternativo
Si prefieres usar tu Chrome instalado:

```bash
./run-e2e-tests.sh
```

### Ejecutar tests específicos

```bash
# Solo test de autenticación
./run-e2e-tests-with-chromium.sh auth

# Solo tests de la página de recepción
./run-e2e-tests-with-chromium.sh reception
```

## Solución de problemas comunes

### 1. Cierres inesperados de Chrome

Si Chrome se cierra inesperadamente durante las pruebas, estas son las causas más comunes:

#### a) Problemas con el ChromeDriver
- **Solución**: Usa `./run-e2e-tests-with-chromium.sh` que descarga y utiliza una versión específica de Chromium compatible con el ChromeDriver incluido.

#### b) Problemas con el modo headless
- **Solución**: Hemos desactivado el modo headless en la configuración para que puedas ver la ejecución de los tests y detectar problemas visualmente.

#### c) Falta de recursos o permisos
- **Solución**: Asegúrate de tener suficiente memoria RAM y espacio en disco. También verifica que no haya restricciones de permisos en el directorio del proyecto.

#### d) Incompatibilidad de versiones
- **Solución**: El script `setup-chromium.sh` descarga una versión específica y estable de Chromium (v114) que es compatible con la mayoría de las versiones de ChromeDriver.

### 2. Errores de selección de elementos

Los tests están configurados para usar diferentes estrategias de selección:
- Selectores específicos de Material UI
- Búsqueda por texto
- Búsqueda de elementos mediante múltiples atributos

Si un test falla porque no encuentra un elemento, revisa los logs de consola para entender qué estrategia alternativa se utilizó.

### 2. Redirecciones inesperadas

Si la aplicación redirige a la página principal o a otra página, puede ser por:
- Problemas de autenticación
- Problemas en la inicialización del contexto de recepción
- Rutas protegidas que requieren permisos específicos

Los tests ahora incluyen una autenticación automática utilizando las credenciales de prueba definidas en `test/data/credentials.ts`. Asegúrate de que estas credenciales sean válidas en tu entorno de pruebas.

### 3. Autenticación para pruebas

Los tests utilizan la función `authenticateForTests()` definida en `test/helpers/auth.ts` para iniciar sesión automáticamente antes de ejecutar las pruebas. 

Para que esto funcione correctamente:
1. Asegúrate de que las credenciales en `test/data/credentials.ts` correspondan a un usuario válido en tu entorno.
2. Si las credenciales cambian, actualiza el archivo `test/data/credentials.ts`.
3. Verifica que el formulario de inicio de sesión tenga los campos `input[name="email"]` y `input[name="password"]` para que la función de autenticación pueda encontrarlos.

### 4. Errores "NotSupportedError: Failed to execute 'evaluate' on 'XPathExpression'"

Este error ocurre cuando WebdriverIO intenta evaluar XPath en un fragment o shadow DOM. Los tests están diseñados para usar selectores CSS en lugar de XPath para evitar este problema.

### 4. Capturas de pantalla de errores

Cuando un test falla, se guarda una captura de pantalla en el directorio `errorShots/`. Revisa estas capturas para entender qué sucedió.

## Consejos para escribir tests robustos

1. **Usa múltiples estrategias de selección**: Combina selectores CSS, aria attributes y texto para encontrar elementos.
2. **Espera suficiente tiempo**: Usa `await browser.pause()` o `waitForExist()` para asegurarte de que los elementos estén listos.
3. **Maneja casos de fallo graciosamente**: Implementa alternativas cuando un selector falla.
4. **Verifica el estado de la página**: Asegúrate de estar en la página correcta antes de hacer afirmaciones.

## Estructura de los tests

Los tests siguen un patrón de tres pasos:

1. **Configuración**: Navegar a la página y esperar a que cargue.
2. **Acción**: Interactuar con elementos en la página.
3. **Aserción**: Verificar que el resultado es el esperado.
