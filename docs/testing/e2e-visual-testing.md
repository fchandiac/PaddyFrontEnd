# Guía para Pruebas E2E Visuales

Este documento explica cómo ejecutar las pruebas E2E en modo visual, permitiendo ver Chrome ejecutando las pruebas en tiempo real.

## Requisitos previos

Asegúrate de tener los siguientes requisitos:

1. Node.js y npm instalados
2. Aplicación en ejecución (en `localhost:3000`)
3. WebdriverIO configurado (ya debería estar listo)

## Scripts disponibles

Se han creado varios scripts para facilitar la ejecución de pruebas visuales:

### 1. `run-visual-e2e.sh`

Script principal y más completo para ejecutar pruebas visuales con varias opciones.

**Opciones disponibles:**
- `-s`, `--slow`: Ejecuta las pruebas en modo lento (pausas más largas)
- `-a`, `--auth`: Ejecuta solo las pruebas de autenticación
- `-h`, `--help`: Muestra la ayuda del script

**Ejemplos de uso:**
```bash
# Ejecutar todas las pruebas en modo visual normal
./run-visual-e2e.sh

# Ejecutar todas las pruebas en modo lento
./run-visual-e2e.sh --slow

# Ejecutar solo las pruebas de autenticación
./run-visual-e2e.sh --auth

# Ejecutar pruebas de autenticación en modo lento
./run-visual-e2e.sh -a -s
```

### 2. `run-visual-tests-slow.sh`

Script específico para ejecutar las pruebas de autenticación en modo visual lento.

```bash
./run-visual-tests-slow.sh
```

### 3. `run-visual-tests.sh`

Script básico para ejecutar las pruebas de autenticación en modo visual normal.

```bash
./run-visual-tests.sh
```

## Modos de visualización

- **Modo normal**: Las pruebas se ejecutan con algunas pausas entre acciones, pero a un ritmo relativamente rápido.
- **Modo lento**: Las pruebas se ejecutan con pausas largas entre acciones y simulación de escritura lenta, ideal para observar en detalle cada paso.

## Capturas de pantalla

Durante la ejecución, las pruebas generan capturas de pantalla en el directorio `./errorShots/`. Estas capturas son útiles para:

1. Verificar visualmente el estado de la aplicación en cada paso
2. Revisar errores si las pruebas fallan
3. Documentar el comportamiento de la aplicación

## Pruebas de autenticación incluidas

Las pruebas visuales de autenticación implementadas incluyen:

1. **Login exitoso**: Verifica que un usuario válido pueda iniciar sesión y acceder a la aplicación.
2. **Contraseña incorrecta**: Verifica que se muestre un error cuando la contraseña es incorrecta.
3. **Usuario inexistente**: Verifica que se muestre un error cuando el usuario no existe.
4. **Acceso a ruta protegida**: Verifica que al intentar acceder a una ruta protegida sin autenticación se redirija al login.

## Consejos para solucionar problemas

- **Chrome no se abre**: Asegúrate de que chromedriver esté correctamente instalado.
- **Pruebas demasiado rápidas**: Usa el modo lento (`--slow`) para ver mejor los pasos.
- **Errores de tiempo de espera**: Aumenta los tiempos de espera en `wdio.conf.ts` si necesitas más tiempo para las transiciones.
- **Problemas con el splash screen**: Ajusta `SPLASH_SCREEN_TIMEOUT` en las pruebas si el tiempo de espera no es suficiente.

## Personalización adicional

Para personalizar más las pruebas visuales, puedes:

1. Modificar `wdio.conf.ts` para ajustar la configuración del navegador
2. Editar los tiempos de espera en `authTest.e2e.ts`
3. Ajustar la función `visualPause` para cambiar el comportamiento de las pausas
4. Modificar `typeSlowly` para ajustar la velocidad de escritura simulada
