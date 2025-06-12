import { authenticateForTests } from '../helpers/auth';
import { TEST_CREDENTIALS } from '../data/credentials';

describe('Prueba de autenticación', () => {
  it('debe autenticarse correctamente', async () => {
    // Verificar que la aplicación está en ejecución
    try {
      await browser.url('http://localhost:3000');
      await browser.pause(2000);
      
      // Tomar captura de pantalla para verificar que la aplicación está en ejecución
      await browser.saveScreenshot('./errorShots/app-running-check.png');
      
      // Obtener título de la página
      const title = await browser.getTitle();
      console.log('Título de la página inicial:', title);
      
      // Obtener texto visible de la página
      const pageText = await browser.execute(() => document.body.innerText);
      console.log('Texto de la página inicial:');
      console.log(pageText.substring(0, 300) + '...');
      
      // Verificar si se muestran los campos de inicio de sesión
      const emailInput = await $('input[name="email"]');
      const passwordInput = await $('input[name="password"]');
      
      const emailExists = await emailInput.isExisting();
      const passwordExists = await passwordInput.isExisting();
      
      console.log('Campo de email existe:', emailExists);
      console.log('Campo de contraseña existe:', passwordExists);
      
      // Intentar autenticarse
      await authenticateForTests(browser);
      
      // Verificar que estamos autenticados navegando a una ruta protegida
      await browser.url('/paddy/receptions/new');
      await browser.pause(3000);
      
      // Obtener URL actual
      const url = await browser.getUrl();
      
      // Verificar que estamos en la página de recepción (no redirigidos al login)
      expect(url).toContain('/paddy/receptions/new');
      
      // Verificar que algunos elementos de la página de recepción existan
      const pageTextAfterAuth = await browser.execute(() => document.body.innerText);
      console.log('Texto de la página después de autenticación:');
      console.log(pageTextAfterAuth.substring(0, 300) + '...');
      
      // Tomar una captura de pantalla para verificar visualmente
      await browser.saveScreenshot('./errorShots/auth-test-success.png');
      
      // Registrar que la autenticación fue exitosa
      console.log('Autenticación exitosa - URL actual:', url);
    } catch (error) {
      console.error('Error durante la prueba de autenticación:', error);
      
      // Tomar captura de pantalla del error
      await browser.saveScreenshot('./errorShots/auth-test-error.png');
      
      // Re-lanzar el error para que la prueba falle
      throw error;
    }
  });
});
