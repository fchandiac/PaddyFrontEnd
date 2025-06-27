// Función para autenticar antes de las pruebas
import { TEST_CREDENTIALS } from '../data/credentials';
import fs from 'fs';

// Función para esperar a que el splash screen desaparezca
async function waitForSplashScreenToDisappear() {
  console.log('Esperando a que el splash screen desaparezca...');
  
  // Esperar a que el splash screen desaparezca (8.5 segundos + margen de seguridad)
  const SPLASH_SCREEN_TIMEOUT = 10000; // 10 segundos 
  
  // Asegurarse de que el directorio errorShots existe
  if (!fs.existsSync('./errorShots')) {
    fs.mkdirSync('./errorShots', { recursive: true });
  }
  
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
}

export async function authenticateForTests(browser: WebdriverIO.Browser) {
  // Navegar a la página de inicio de sesión
  await browser.url('/');
  
  // Asegurarse de que el directorio errorShots existe
  if (!fs.existsSync('./errorShots')) {
    fs.mkdirSync('./errorShots', { recursive: true });
  }
  
  // Esperar a que el splash screen desaparezca
  await waitForSplashScreenToDisappear();
  
  // Tomar captura de pantalla para depuración
  await browser.saveScreenshot('./errorShots/auth-before-login.png');
  
  // Llenar credenciales de prueba
  const emailInput = await $('input[name="email"]');
  const passwordInput = await $('input[name="password"]');
  const loginButton = await $('button[type="submit"]');
  
  // Verificar que los elementos existen antes de interactuar
  await emailInput.waitForExist({ timeout: 5000 });
  await passwordInput.waitForExist({ timeout: 5000 });
  await loginButton.waitForExist({ timeout: 5000 });
  
  // Registrar información para depuración
  console.log('Intentando iniciar sesión con las siguientes credenciales:');
  console.log(`Email: ${TEST_CREDENTIALS.email}`);
  console.log(`Password: ${TEST_CREDENTIALS.password.replace(/./g, '*')}`);
  
  // Llenar el formulario con credenciales de prueba
  await emailInput.setValue(TEST_CREDENTIALS.email);
  await passwordInput.setValue(TEST_CREDENTIALS.password);
  
  // Hacer clic en iniciar sesión
  await loginButton.click();
  
  // Esperar a que la autenticación se complete y se redirija
  await browser.pause(8000); // Aumentado a 8 segundos para dar más tiempo
  
  // Tomar captura de pantalla después del intento de inicio de sesión
  await browser.saveScreenshot('./errorShots/auth-after-login.png');
  
  // Verificar que estamos autenticados (opcional)
  const url = await browser.getUrl();
  
  // Imprimir la URL para depuración
  console.log('URL después del intento de inicio de sesión:', url);
  
  // Verificar si hay mensajes de error en la página
  try {
    const pageText = await browser.execute(() => document.body.innerText);
    console.log('Texto de la página después del intento de inicio de sesión:');
    console.log(pageText.substring(0, 500) + '...');
    
    if (pageText.includes('error') || pageText.includes('Error') || 
        pageText.includes('credenciales') || pageText.includes('inválido')) {
      console.log('Se encontró un mensaje de error en la página');
    }
  } catch (e) {
    console.log('Error al obtener texto de la página:', e);
  }
  
  if (!url.includes('/paddy')) {
    console.log('Autenticación fallida. No fuimos redirigidos a una página protegida.');
    throw new Error('La autenticación falló. Verifica las credenciales de prueba.');
  }
  
  console.log('Autenticación exitosa para pruebas. URL actual:', url);
}
