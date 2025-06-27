# Pruebas E2E para Autenticación

Este documento describe las pruebas end-to-end (E2E) para validar la funcionalidad de autenticación en la aplicación Paddy.

## Casos de Prueba

### 1. Autenticación Exitosa

**Objetivo**: Verificar que un usuario puede iniciar sesión correctamente con credenciales válidas.

**Pasos**:
1. Navegar a la página de inicio de sesión
2. Ingresar un correo electrónico válido
3. Ingresar una contraseña válida
4. Hacer clic en el botón de iniciar sesión
5. Verificar la redirección a la página principal después de la autenticación exitosa

**Resultados Esperados**:
- El usuario es redirigido a la página principal o dashboard
- Los elementos de la interfaz muestran que el usuario está autenticado (ej: nombre de usuario visible)
- No se muestran mensajes de error

**Implementación**:
```typescript
it('debe autenticar exitosamente con credenciales válidas', async () => {
  // Navegar a la página de inicio de sesión
  await browser.url('/');
  await browser.pause(2000);
  
  // Verificar que estamos en la página de login
  const emailInput = await $('input[name="email"]');
  const passwordInput = await $('input[name="password"]');
  const loginButton = await $('button[type="submit"]');
  
  await emailInput.waitForExist({ timeout: 5000 });
  await passwordInput.waitForExist({ timeout: 5000 });
  
  // Ingresar credenciales válidas
  await emailInput.setValue(TEST_CREDENTIALS.email);
  await passwordInput.setValue(TEST_CREDENTIALS.password);
  
  // Hacer clic en iniciar sesión
  await loginButton.click();
  
  // Esperar a que se complete la autenticación y redirección
  await browser.pause(5000);
  
  // Verificar redirección a página protegida
  const currentUrl = await browser.getUrl();
  expect(currentUrl).toContain('/paddy'); // La URL después del login debe contener /paddy
  
  // Verificar que elementos de usuario autenticado están presentes
  const userProfileElement = await $('.user-profile'); // Selector del elemento que muestra info del usuario
  expect(await userProfileElement.isExisting()).toBe(true);
  
  // Verificar que no hay mensajes de error visibles
  const errorMessages = await $$('.error-message');
  expect(errorMessages.length).toBe(0);
});
```

### 2. Autenticación Fallida - Credenciales Incorrectas

**Objetivo**: Verificar que se muestra un mensaje de error apropiado cuando se ingresan credenciales incorrectas.

**Pasos**:
1. Navegar a la página de inicio de sesión
2. Ingresar un correo electrónico existente
3. Ingresar una contraseña incorrecta
4. Hacer clic en el botón de iniciar sesión
5. Verificar que se muestra un mensaje de error adecuado

**Resultados Esperados**:
- El usuario permanece en la página de inicio de sesión
- Se muestra un mensaje de error claro indicando que las credenciales son incorrectas
- Los campos de entrada mantienen su valor para permitir correcciones

**Implementación**:
```typescript
it('debe mostrar error con contraseña incorrecta', async () => {
  // Navegar a la página de inicio de sesión
  await browser.url('/');
  await browser.pause(2000);
  
  // Verificar que estamos en la página de login
  const emailInput = await $('input[name="email"]');
  const passwordInput = await $('input[name="password"]');
  const loginButton = await $('button[type="submit"]');
  
  await emailInput.waitForExist({ timeout: 5000 });
  await passwordInput.waitForExist({ timeout: 5000 });
  
  // Ingresar email válido pero contraseña incorrecta
  await emailInput.setValue(TEST_CREDENTIALS.email);
  await passwordInput.setValue('contraseña_incorrecta');
  
  // Hacer clic en iniciar sesión
  await loginButton.click();
  
  // Esperar a que aparezca el mensaje de error
  await browser.pause(3000);
  
  // Verificar que seguimos en la página de login
  const currentUrl = await browser.getUrl();
  expect(currentUrl).toContain('/api/auth/signin'); // O la ruta de tu página de login
  
  // Verificar que aparece mensaje de error
  const errorMessage = await $('.error');
  expect(await errorMessage.isExisting()).toBe(true);
  expect(await errorMessage.getText()).toContain('credenciales'); // El mensaje debe mencionar algo sobre credenciales
  
  // Verificar que los campos mantienen sus valores
  expect(await emailInput.getValue()).toBe(TEST_CREDENTIALS.email);
  // No verificamos el valor de la contraseña ya que podría limpiarse por seguridad
});
```

### 3. Autenticación Fallida - Usuario No Existente

**Objetivo**: Verificar que se muestra un mensaje de error apropiado cuando se ingresa un correo electrónico que no existe en el sistema.

**Pasos**:
1. Navegar a la página de inicio de sesión
2. Ingresar un correo electrónico que no existe en el sistema
3. Ingresar cualquier contraseña
4. Hacer clic en el botón de iniciar sesión
5. Verificar que se muestra un mensaje de error adecuado

**Resultados Esperados**:
- El usuario permanece en la página de inicio de sesión
- Se muestra un mensaje de error claro indicando que el usuario no existe
- Los campos de entrada mantienen su valor para permitir correcciones

**Implementación**:
```typescript
it('debe mostrar error con usuario inexistente', async () => {
  // Navegar a la página de inicio de sesión
  await browser.url('/');
  await browser.pause(2000);
  
  // Verificar que estamos en la página de login
  const emailInput = await $('input[name="email"]');
  const passwordInput = await $('input[name="password"]');
  const loginButton = await $('button[type="submit"]');
  
  await emailInput.waitForExist({ timeout: 5000 });
  await passwordInput.waitForExist({ timeout: 5000 });
  
  // Ingresar email que no existe
  const nonExistentEmail = 'usuario_no_existente@example.com';
  await emailInput.setValue(nonExistentEmail);
  await passwordInput.setValue('cualquier_contraseña');
  
  // Hacer clic en iniciar sesión
  await loginButton.click();
  
  // Esperar a que aparezca el mensaje de error
  await browser.pause(3000);
  
  // Verificar que seguimos en la página de login
  const currentUrl = await browser.getUrl();
  expect(currentUrl).toContain('/api/auth/signin'); // O la ruta de tu página de login
  
  // Verificar que aparece mensaje de error
  const errorMessage = await $('.error');
  expect(await errorMessage.isExisting()).toBe(true);
  expect(await errorMessage.getText()).toContain('usuario'); // El mensaje debe mencionar algo sobre el usuario
  
  // Verificar que los campos mantienen sus valores
  expect(await emailInput.getValue()).toBe(nonExistentEmail);
  // No verificamos el valor de la contraseña ya que podría limpiarse por seguridad
});
```

### 4. Intento de Acceso a Ruta Protegida sin Autenticación

**Objetivo**: Verificar que un usuario no autenticado es redirigido a la página de inicio de sesión cuando intenta acceder a una ruta protegida.

**Pasos**:
1. Asegurarse de que no hay una sesión activa (cerrar sesión si es necesario)
2. Intentar navegar directamente a una ruta protegida (ej: `/paddy/receptions/new`)
3. Verificar la redirección a la página de inicio de sesión

**Resultados Esperados**:
- El usuario es redirigido a la página de inicio de sesión
- Se muestra un mensaje indicando que debe iniciar sesión para acceder
- Después de iniciar sesión, se redirige automáticamente a la página que intentaba acceder

**Implementación**:
```typescript
it('debe redirigir a login al intentar acceder a ruta protegida', async () => {
  // Navegar directamente a una ruta protegida
  await browser.url('/paddy/receptions/new');
  await browser.pause(3000);
  
  // Verificar que fuimos redirigidos a la página de login
  const currentUrl = await browser.getUrl();
  expect(currentUrl).toContain('/api/auth/signin'); // O la ruta de tu página de login
  
  // Verificar que existe el formulario de login
  const emailInput = await $('input[name="email"]');
  const passwordInput = await $('input[name="password"]');
  
  expect(await emailInput.isExisting()).toBe(true);
  expect(await passwordInput.isExisting()).toBe(true);
  
  // Verificar si hay un mensaje informativo sobre la necesidad de iniciar sesión
  const infoMessage = await $('.info-message'); // Ajustar selector según tu aplicación
  if (await infoMessage.isExisting()) {
    expect(await infoMessage.getText()).toContain('iniciar sesión');
  }
  
  // Ahora iniciar sesión y verificar redirección a la página original
  await emailInput.setValue(TEST_CREDENTIALS.email);
  await passwordInput.setValue(TEST_CREDENTIALS.password);
  
  const loginButton = await $('button[type="submit"]');
  await loginButton.click();
  
  // Esperar a que se complete la autenticación y redirección
  await browser.pause(5000);
  
  // Verificar que fuimos redirigidos a la página que intentábamos acceder
  const redirectedUrl = await browser.getUrl();
  expect(redirectedUrl).toContain('/paddy/receptions/new');
});
```

## Estructura del Archivo de Prueba

La estructura completa del archivo de prueba para autenticación podría ser:

```typescript
/// <reference types="@wdio/globals/types" />
/// <reference types="@wdio/mocha-framework" />

import { TEST_CREDENTIALS } from '../../data/credentials';

describe('Autenticación', () => {
  beforeEach(async () => {
    // Limpiar cualquier sesión anterior
    await browser.reloadSession();
  });
  
  // Aquí irían los casos de prueba descritos anteriormente
  it('debe autenticar exitosamente con credenciales válidas', async () => {
    // Implementación...
  });
  
  it('debe mostrar error con contraseña incorrecta', async () => {
    // Implementación...
  });
  
  it('debe mostrar error con usuario inexistente', async () => {
    // Implementación...
  });
  
  it('debe redirigir a login al intentar acceder a ruta protegida', async () => {
    // Implementación...
  });
});
```

## Consideraciones para la Implementación

1. **Selectores Robustos**: Es importante utilizar selectores que sean poco propensos a cambiar con actualizaciones de la interfaz.

2. **Tiempos de Espera Adecuados**: Ajustar los tiempos de espera según la velocidad de respuesta de la aplicación y la infraestructura de pruebas.

3. **Capturas de Pantalla**: Incluir capturas de pantalla en puntos clave para ayudar en la depuración de fallos.

4. **Limpieza de Sesiones**: Asegurarse de que cada prueba comience con un estado limpio (sin sesiones previas).

5. **Manejo de Errores**: Incluir manejo adecuado de errores y mensajes informativos para facilitar la depuración.

## Pruebas Adicionales (Futuras)

- **Bloqueo de Cuenta**: Verificar que la cuenta se bloquea después de múltiples intentos fallidos (si aplica).
- **Recuperación de Contraseña**: Probar el flujo de recuperación de contraseña.
- **Cierre de Sesión**: Verificar que el cierre de sesión funciona correctamente.
- **Expiración de Sesión**: Comprobar que la sesión expira después de un tiempo de inactividad (si aplica).
