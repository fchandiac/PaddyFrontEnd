# Correcciones en las Pruebas de Autenticación

## Problemas Identificados y Soluciones Implementadas

### 1. Problema del Splash Screen

**Problema:** Los tests de autenticación fallaban porque intentaban interactuar con los campos de login antes de que el splash screen (que dura 8.5 segundos) desapareciera.

**Solución implementada:**
- Se creó una función auxiliar `waitForSplashScreenToDisappear()` que espera a que los elementos del formulario de login estén disponibles.
- Esta función utiliza `browser.waitUntil()` para esperar dinámicamente, comprobando la disponibilidad de los elementos del login cada 500ms.
- Se estableció un timeout de 10 segundos para esta espera, considerando los 8.5 segundos del splash screen más un margen de seguridad.
- Se añadieron capturas de pantalla antes y después del splash screen para facilitar la depuración.

### 2. Problema del Directorio errorShots

**Problema:** Las pruebas fallaban porque intentaban guardar capturas de pantalla en el directorio `/errorShots` que no existía.

**Solución implementada:**
- Se modificó el código para crear automáticamente el directorio `errorShots` si no existe.
- Se implementó esta verificación en:
  - La función `authenticateForTests()` en el helper de autenticación.
  - El hook `before()` en las pruebas de autenticación.
- Se creó un script dedicado `run-auth-tests.sh` que crea el directorio antes de ejecutar las pruebas.

### 3. Mejoras en los Selectores y Verificaciones

**Problema:** Algunos selectores y verificaciones no se correspondían con la estructura real de la aplicación.

**Solución implementada:**
- Se actualizaron los selectores para utilizar elementos que existen en la aplicación real, como `[role="alert"]` para los mensajes de error.
- Se ajustaron las verificaciones de URL para comprobar patrones más generales (como `/paddy`) en lugar de rutas exactas.
- Se mejoró la verificación de errores para buscar el texto "credenciales" que aparece en los mensajes de error reales.

## Archivos Modificados

1. `/test/specs/auth/authTest.e2e.ts`
   - Añadida función `waitForSplashScreenToDisappear()`
   - Añadido hook `before()` para crear el directorio errorShots
   - Actualizado cada test case para esperar a que el splash screen desaparezca
   - Mejorados los selectores y verificaciones

2. `/test/helpers/auth.ts`
   - Añadida función `waitForSplashScreenToDisappear()`
   - Actualizada la función `authenticateForTests()` para manejar el splash screen
   - Añadida verificación para crear el directorio errorShots si no existe

3. Creado script `/run-auth-tests.sh`
   - Script dedicado para ejecutar solo las pruebas de autenticación
   - Crea automáticamente el directorio errorShots antes de ejecutar las pruebas

## Ejecución de las Pruebas

Para ejecutar las pruebas de autenticación, usar el nuevo script:

```bash
./run-auth-tests.sh
```

Este script:
1. Crea el directorio errorShots si no existe
2. Ejecuta solo las pruebas de autenticación
3. Muestra un mensaje de finalización

## Notas Adicionales

- El splash screen aparece solo en la primera carga de la sesión, gracias al uso de sessionStorage en el hook `useSplashScreen`.
- Los tiempos de espera se han ajustado para dar suficiente margen a las transiciones y animaciones.
- Se han añadido capturas de pantalla en puntos clave para facilitar la depuración.
