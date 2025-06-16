describe('Página principal de la aplicación', () => {
  beforeEach(async () => {
    console.log('Iniciando prueba en la página principal');
    // Navegamos a la página principal
    await browser.url('/');
    // Esperamos a que la página cargue completamente
    await browser.pause(2000);
  });

  it('debe cargar correctamente', async () => {
    console.log('Verificando título de la página');
    // Obtenemos el título de la página
    const title = await browser.getTitle();
    console.log(`Título de la página: ${title}`);
    // Verificamos que el título contenga la palabra "Paddy"
    expect(title).toContain('Paddy');
  });

  it('debe mostrar la página de inicio', async () => {
    console.log('Verificando si la página cargó correctamente');
    
    // Verificamos que estamos en la página correcta buscando cualquier elemento visible
    try {
      // Esperamos a que el body sea visible
      const body = await $('body');
      await body.waitForExist({ timeout: 5000 });
      await expect(body).toBeDisplayed();
      
      console.log('La página se cargó correctamente');
    } catch (error) {
      console.error('Error al cargar la página:', error);
      // Tomamos una captura de pantalla en caso de error
      await browser.saveScreenshot('./error-screenshot.png');
      throw error;
    }
  });
});
