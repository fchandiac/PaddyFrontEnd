/// <reference types="@wdio/globals/types" />
/// <reference types="@wdio/mocha-framework" />

import { authenticateForTests } from '../../helpers/auth';
import { TEST_CREDENTIALS } from '../../data/credentials';

// Crear el directorio errorShots si no existe
import fs from 'fs';
import path from 'path';

// Variables para control visual de las pruebas
const VISUAL_MODE = process.env.TEST_MODE === 'VISUAL';
const SLOW_MOTION = parseInt(process.env.TEST_SLOW_MOTION || '0', 10); // Pausa entre acciones
const SPLASH_SCREEN_TIMEOUT = VISUAL_MODE ? 15000 : 10000; // Tiempo de espera extendido en modo visual

// Función para esperar a que el splash screen desaparezca
async function waitForSplashScreenToDisappear() {
  console.log('Esperando a que el splash screen desaparezca...');
  
  // Capturar el estado inicial para verificar
  await browser.saveScreenshot('./errorShots/splash-screen.png');
  
  // Establecer un timeout para evitar esperar indefinidamente
  const startTime = Date.now();
  
  // Esperar hasta que aparezcan los elementos del login o se agote el tiempo
  await browser.waitUntil(
    async () => {
      try {
        // Intentar encontrar elementos del formulario de login
        const emailInput = await $('input[name="email"]');
        return await emailInput.isExisting();
      } catch (error) {
        return false;
      }
    },
    {
      timeout: SPLASH_SCREEN_TIMEOUT,
      timeoutMsg: 'El splash screen no desapareció dentro del tiempo esperado',
      interval: 500, // Comprobar cada 500ms
    }
  );
  
  console.log(`Splash screen desaparecido después de ${Date.now() - startTime}ms`);
  await browser.saveScreenshot('./errorShots/after-splash-screen.png');
  
  // Pausa adicional para visualización en modo visual
  if (VISUAL_MODE) {
    console.log('Pausa para visualización...');
    await browser.pause(2000);
  }
}

// Función de utilidad para pausas controladas
async function visualPause(message: string, duration: number = SLOW_MOTION) {
  if (VISUAL_MODE && duration > 0) {
    console.log(`[VISUAL] ${message}`);
    await browser.pause(duration);
  }
}

// Función para simular escritura humana lenta en modo visual
async function typeSlowly(element: any, text: string) {
  if (VISUAL_MODE && SLOW_MOTION > 0) {
    for (const char of text) {
      await element.addValue(char);
      await browser.pause(Math.floor(Math.random() * 200) + 50); // Entre 50-250ms por tecla
    }
  } else {
    await element.setValue(text);
  }
}

describe('Pruebas de Autenticación', () => {
  // Crear directorio errorShots antes de todas las pruebas
  before(async () => {
    const errorShotsDir = './errorShots';
    if (!fs.existsSync(errorShotsDir)) {
      fs.mkdirSync(errorShotsDir, { recursive: true });
      console.log('Directorio errorShots creado');
    }
    
    if (VISUAL_MODE) {
      console.log('⚠️ EJECUTANDO EN MODO VISUAL - PAUSAS EXTENDIDAS ACTIVADAS');
    }
  });
  
  beforeEach(async () => {
    // Limpiar cualquier sesión anterior
    await browser.reloadSession();
  });

  it('debe autenticarse correctamente con credenciales válidas', async () => {
    // Navegar a la página de inicio de sesión
    await browser.url('/');
    await visualPause('Página cargada, esperando splash screen...', 1000);
    
    // Esperar a que el splash screen desaparezca
    await waitForSplashScreenToDisappear();
    
    // Tomar captura de pantalla para verificar que la aplicación está en ejecución
    await browser.saveScreenshot('./errorShots/auth-test-before-login.png');
    await visualPause('Pantalla de login visible', 1500);
    
    // Verificar que estamos en la página de login
    const emailInput = await $('input[name="email"]');
    const passwordInput = await $('input[name="password"]');
    const loginButton = await $('button[type="submit"]');
    
    await emailInput.waitForExist({ timeout: 5000 });
    await passwordInput.waitForExist({ timeout: 5000 });
    
    // Enfocar el campo de email
    await emailInput.click();
    await visualPause('Campo de email enfocado', 1000);
    
    // Ingresar credenciales válidas lentamente en modo visual
    await visualPause('Ingresando email...', 500);
    await typeSlowly(emailInput, TEST_CREDENTIALS.email);
    await visualPause('Email ingresado', 1000);
    
    // Cambiar al campo de contraseña
    await passwordInput.click();
    await visualPause('Campo de contraseña enfocado', 1000);
    
    await visualPause('Ingresando contraseña...', 500);
    await typeSlowly(passwordInput, TEST_CREDENTIALS.password);
    await visualPause('Contraseña ingresada', 1000);
    
    // Resaltar el botón antes de hacer clic usando JavaScript
    await browser.execute('arguments[0].style.border = "2px solid red"', await loginButton);
    await visualPause('Haciendo clic en iniciar sesión...', 1500);
    
    // Hacer clic en iniciar sesión
    await loginButton.click();
    
    // Esperar a que se complete la autenticación y redirección con tiempo extendido en modo visual
    const waitTime = VISUAL_MODE ? 8000 : 5000;
    console.log(`Esperando redirección (${waitTime}ms)...`);
    await browser.pause(waitTime);
    
    // Verificar redirección a página protegida
    const currentUrl = await browser.getUrl();
    console.log(`URL actual: ${currentUrl}`);
    expect(currentUrl).toContain('/paddy'); // La URL después del login debe contener /paddy
    
    // Verificar que elementos de usuario autenticado están presentes
    const userProfileElement = await $('.MuiToolbar-root');
    expect(await userProfileElement.isExisting()).toBe(true);
    
    // Tomar captura de pantalla del estado autenticado
    await browser.saveScreenshot('./errorShots/auth-test-after-login.png');
    await visualPause('Autenticación completa - visualizando dashboard', 5000);
  });

  it('debe mostrar error con contraseña incorrecta', async () => {
    // Navegar a la página de inicio de sesión
    await browser.url('/');
    await visualPause('Página cargada, esperando splash screen...', 1000);
    
    // Esperar a que el splash screen desaparezca
    await waitForSplashScreenToDisappear();
    
    // Verificar que estamos en la página de login
    const emailInput = await $('input[name="email"]');
    const passwordInput = await $('input[name="password"]');
    const loginButton = await $('button[type="submit"]');
    
    // Enfocar el campo de email
    await emailInput.click();
    await visualPause('Campo de email enfocado', 1000);
    
    // Ingresar email correcto
    await visualPause('Ingresando email...', 500);
    await typeSlowly(emailInput, TEST_CREDENTIALS.email);
    await visualPause('Email ingresado', 1000);
    
    // Cambiar al campo de contraseña
    await passwordInput.click();
    await visualPause('Campo de contraseña enfocado', 1000);
    
    // Ingresar contraseña incorrecta
    await visualPause('Ingresando contraseña incorrecta...', 500);
    await typeSlowly(passwordInput, 'contraseñaIncorrecta123');
    await visualPause('Contraseña incorrecta ingresada', 1000);
    
    // Resaltar el botón antes de hacer clic
    await browser.execute('arguments[0].style.border = "2px solid red"', await loginButton);
    await visualPause('Haciendo clic en iniciar sesión...', 1500);
    
    // Hacer clic en iniciar sesión
    await loginButton.click();
    
    // Esperar a que aparezca el mensaje de error
    await visualPause('Esperando mensaje de error...', 3000);
    
    // Buscar mensaje de error - ajustar selector según la estructura real
    const errorMessage = await $('.MuiAlert-message');
    await errorMessage.waitForExist({ timeout: 5000 });
    expect(await errorMessage.isDisplayed()).toBe(true);
    
    // Tomar captura de pantalla del error
    await browser.saveScreenshot('./errorShots/auth-test-wrong-password.png');
    await visualPause('Error de contraseña mostrado', 3000);
  });

  it('debe mostrar error con usuario inexistente', async () => {
    // Navegar a la página de inicio de sesión
    await browser.url('/');
    await visualPause('Página cargada, esperando splash screen...', 1000);
    
    // Esperar a que el splash screen desaparezca
    await waitForSplashScreenToDisappear();
    
    // Verificar que estamos en la página de login
    const emailInput = await $('input[name="email"]');
    const passwordInput = await $('input[name="password"]');
    const loginButton = await $('button[type="submit"]');
    
    // Enfocar el campo de email
    await emailInput.click();
    await visualPause('Campo de email enfocado', 1000);
    
    // Ingresar email inexistente
    await visualPause('Ingresando email inexistente...', 500);
    await typeSlowly(emailInput, 'usuario.inexistente@example.com');
    await visualPause('Email inexistente ingresado', 1000);
    
    // Cambiar al campo de contraseña
    await passwordInput.click();
    await visualPause('Campo de contraseña enfocado', 1000);
    
    // Ingresar contraseña cualquiera
    await visualPause('Ingresando contraseña...', 500);
    await typeSlowly(passwordInput, 'contraseña123');
    await visualPause('Contraseña ingresada', 1000);
    
    // Resaltar el botón antes de hacer clic
    await browser.execute('arguments[0].style.border = "2px solid red"', await loginButton);
    await visualPause('Haciendo clic en iniciar sesión...', 1500);
    
    // Hacer clic en iniciar sesión
    await loginButton.click();
    
    // Esperar a que aparezca el mensaje de error
    await visualPause('Esperando mensaje de error...', 3000);
    
    // Buscar mensaje de error - ajustar selector según la estructura real
    const errorMessage = await $('.MuiAlert-message');
    await errorMessage.waitForExist({ timeout: 5000 });
    expect(await errorMessage.isDisplayed()).toBe(true);
    
    // Tomar captura de pantalla del error
    await browser.saveScreenshot('./errorShots/auth-test-user-not-found.png');
    await visualPause('Error de usuario inexistente mostrado', 3000);
  });

  it('debe redirigir a login al intentar acceder a ruta protegida sin autenticación', async () => {
    // Intentar acceder directamente a una ruta protegida
    await browser.url('/paddy');
    await visualPause('Intentando acceder a ruta protegida...', 1000);
    
    // Esperar a que el splash screen desaparezca (si aplica)
    await waitForSplashScreenToDisappear();
    
    // Verificar que fuimos redirigidos a la página de login
    const emailInput = await $('input[name="email"]');
    await emailInput.waitForExist({ timeout: 10000 });
    expect(await emailInput.isExisting()).toBe(true);
    
    // Tomar captura de pantalla de la redirección
    await browser.saveScreenshot('./errorShots/auth-test-protected-route-redirect.png');
    await visualPause('Redirección a login completada', 3000);
  });
  
  // Esta prueba solo se ejecuta en modo visual para dar tiempo a observar la interfaz
  it('visualización de la interfaz después de autenticación (solo en modo visual)', async function() {
    // Omitir esta prueba si no estamos en modo visual
    if (!VISUAL_MODE) {
      this.skip();
      return;
    }
    
    // Navegar a la página de inicio de sesión
    await browser.url('/');
    await visualPause('Página cargada, esperando splash screen...', 1000);
    
    // Esperar a que el splash screen desaparezca
    await waitForSplashScreenToDisappear();
    
    // Verificar que estamos en la página de login
    const emailInput = await $('input[name="email"]');
    const passwordInput = await $('input[name="password"]');
    const loginButton = await $('button[type="submit"]');
    
    await emailInput.waitForExist({ timeout: 5000 });
    
    // Enfocar el campo de email
    await emailInput.click();
    await visualPause('Campo de email enfocado', 1000);
    
    // Ingresar credenciales válidas lentamente
    await visualPause('Ingresando email...', 500);
    await typeSlowly(emailInput, TEST_CREDENTIALS.email);
    await visualPause('Email ingresado', 1000);
    
    // Cambiar al campo de contraseña
    await passwordInput.click();
    await visualPause('Campo de contraseña enfocado', 1000);
    
    await visualPause('Ingresando contraseña...', 500);
    await typeSlowly(passwordInput, TEST_CREDENTIALS.password);
    await visualPause('Contraseña ingresada', 1000);
    
    // Resaltar el botón antes de hacer clic
    await browser.execute('arguments[0].style.border = "2px solid red"', await loginButton);
    await visualPause('Haciendo clic en iniciar sesión...', 1500);
    
    // Hacer clic en iniciar sesión
    await loginButton.click();
    
    // Esperar a que se complete la autenticación y redirección
    const waitTime = 5000;
    await browser.pause(waitTime);
    
    // Verificar redirección a página protegida
    const currentUrl = await browser.getUrl();
    expect(currentUrl).toContain('/paddy');
    
    // Tomar captura de pantalla del estado autenticado
    await browser.saveScreenshot('./errorShots/auth-visual-tour.png');
    
    // Pausa extendida para explorar visualmente la interfaz
    console.log('Explorando la interfaz de usuario...');
    
    // Intentar localizar elementos principales de la interfaz
    try {
      // Explorar la barra de navegación
      const navBar = await $('.MuiToolbar-root');
      if (await navBar.isExisting()) {
        await navBar.scrollIntoView();
        await browser.execute('arguments[0].style.border = "2px solid green"', await navBar);
        await visualPause('Barra de navegación', 3000);
      }
      
      // Explorar menú lateral si existe
      const sideMenu = await $('.MuiDrawer-root');
      if (await sideMenu.isExisting()) {
        await sideMenu.scrollIntoView();
        await browser.execute('arguments[0].style.border = "2px solid blue"', await sideMenu);
        await visualPause('Menú lateral', 3000);
      }
      
      // Explorar contenido principal
      const mainContent = await $('.MuiContainer-root');
      if (await mainContent.isExisting()) {
        await mainContent.scrollIntoView();
        await browser.execute('arguments[0].style.border = "2px solid orange"', await mainContent);
        await visualPause('Contenido principal', 3000);
      }
      
    } catch (error: any) {
      console.log('No se pudieron resaltar algunos elementos:', error.message || 'Error desconocido');
    }
    
    // Pausa final para observar toda la interfaz
    await visualPause('Observando la interfaz completa antes de finalizar', 8000);
  });
});
