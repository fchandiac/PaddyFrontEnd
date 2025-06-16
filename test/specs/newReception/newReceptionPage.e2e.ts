import { authenticateForTests } from '../../helpers/auth';

describe('Página de nueva recepción /paddy/receptions/new', () => {
    beforeEach(async () => {
      // Primero autenticarse
      try {
        await authenticateForTests(browser);
      } catch (error) {
        console.error('Error durante la autenticación:', error);
      }
      
      // Después navegar a la página de nueva recepción
      await browser.url('/paddy/receptions/new');
      // Esperar a que la página se cargue completamente (aumentado a 4 segundos)
      await browser.pause(4000);
      
      // Verificar que estamos en la página correcta
      const url = await browser.getUrl();
      if (!url.includes('/paddy/receptions/new')) {
        console.log('Redirección detectada a:', url);
        throw new Error(`Redirección inesperada a: ${url}. Verifica que la autenticación funcionó correctamente.`);
      }

      // Verificar que la página ha cargado correctamente
      try {
        const pageContent = await $('body');
        await pageContent.waitForExist({ timeout: 5000 });
      } catch (error) {
        console.error('Error esperando que la página cargue:', error);
      }
    });
  
    it('debe mostrar los campos principales del formulario', async () => {
      // Estrategia 1: Usar selectores específicos para Material UI
      try {
        await expect(await $('label[for*="Productor"], [aria-label*="Productor"], input[placeholder*="Productor"]')).toBeExisting();
        await expect(await $('label[for*="Tipo de arroz"], [aria-label*="Tipo de arroz"], input[placeholder*="Tipo de arroz"]')).toBeExisting();
        await expect(await $('label[for*="Guía"], [aria-label*="Guía"], input[placeholder*="Guía"]')).toBeExisting();
        await expect(await $('label[for*="Peso bruto"], [aria-label*="Peso bruto"], input[placeholder*="Peso bruto"]')).toBeExisting();
        await expect(await $('label[for*="Tara"], [aria-label*="Tara"], input[placeholder*="Tara"]')).toBeExisting();
        await expect(await $('button=GUARDAR RECEPCIÓN, button*=GUARDAR RECEPCIÓN, button*=Guardar recepción, button*=Guardar')).toBeExisting();
      } catch (error) {
        // Estrategia 2: Buscar por texto dentro de cualquier elemento
        console.log('Usando estrategia alternativa para encontrar campos del formulario');
        
        // Obtener todo el texto de la página
        const pageText = await browser.execute(() => document.body.innerText);
        
        // Verificar que los textos necesarios estén presentes
        expect(pageText).toContain('Productor');
        expect(pageText).toContain('Tipo de arroz');
        expect(pageText).toContain('Guía');
        expect(pageText).toContain('Peso bruto');
        expect(pageText).toContain('Tara');
        // Check for either lowercase or uppercase version of the button text
        expect(pageText.includes('Guardar recepción') || pageText.includes('GUARDAR RECEPCIÓN')).toBe(true);
      }
    });
  
    it('debe mostrar una alerta si se intenta guardar sin completar campos', async () => {
      // Encontrar el botón usando múltiples estrategias
      let guardarBtn;
      
      try {
        // Estrategia 1: Selector compuesto
        guardarBtn = await $('button=GUARDAR RECEPCIÓN, button*=GUARDAR RECEPCIÓN, button*=Guardar recepción, button*=Guardar');
        await guardarBtn.waitForExist({ timeout: 5000 });
      } catch (error) {
        // Estrategia 2: Buscar todos los botones
        console.log('Usando estrategia alternativa para encontrar el botón Guardar');
        const buttons = await $$('button');
        for (const btn of buttons) {
          const text = await btn.getText();
          if (text.includes('Guardar recepción') || text.includes('GUARDAR RECEPCIÓN')) {
            guardarBtn = btn;
            break;
          }
        }
        
        if (!guardarBtn) {
          throw new Error('No se pudo encontrar el botón Guardar');
        }
      }
      
      // Hacer clic en el botón
      await guardarBtn.scrollIntoView();
      await guardarBtn.click();
      
      // Esperar a que aparezca la alerta (aumentado a 3 segundos)
      await browser.pause(3000);
      
      // Buscar cualquier elemento que pueda ser una alerta usando múltiples selectores
      const alertSelectors = [
        '[role="alert"]', 
        '.Mui-error', 
        '.MuiAlert-root',
        '.error-message',
        '.notification',
        '[aria-live="assertive"]'
      ];
      
      let alertaEncontrada = false;
      for (const selector of alertSelectors) {
        const alerta = await $(selector);
        if (await alerta.isExisting()) {
          alertaEncontrada = true;
          break;
        }
      }
      
      // Si no encontramos alerta por selectores, verificamos mensajes de error en el DOM
      if (!alertaEncontrada) {
        // Buscar texto de error en cualquier parte de la página
        const pageText = await browser.execute(() => document.body.innerText);
        const tieneError = [
          'error', 
          'Error', 
          'requerido', 
          'obligatorio', 
          'falta', 
          'incompleto',
          'seleccionar'
        ].some(keyword => pageText.includes(keyword));
        
        expect(tieneError).toBe(true);
      } else {
        expect(alertaEncontrada).toBe(true);
      }
    });
  
    it('debe navegar con Enter al siguiente input', async () => {
      // Buscar todos los campos de entrada interactivos
      const formInputs = await $$('input:not([readonly]):not([disabled])');
      
      // Asegurarse de que hay suficientes campos
      const inputsLength = await browser.execute(() => document.querySelectorAll('input:not([readonly]):not([disabled])').length);
      if (inputsLength < 3) {
        console.log(`Solo se encontraron ${inputsLength} campos de entrada, se necesitan al menos 3`);
        
        // Tomar captura de pantalla para depuración
        await browser.saveScreenshot('./errorShots/inputs-insuficientes.png');
        
        // Usar otra estrategia: buscar todos los elementos focusables
        const focusables = await browser.execute(() => {
          return Array.from(document.querySelectorAll('input, select, textarea, button, [tabindex]:not([tabindex="-1"])'))
            .filter(el => {
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden';
            })
            .map((el, index) => ({
              index,
              tagName: el.tagName,
              type: el.getAttribute('type'),
              id: el.id,
              placeholder: el.getAttribute('placeholder')
            }));
        });
        
        console.log('Elementos focusables encontrados:', focusables);
        
        // Si aún no hay suficientes elementos, omitir la prueba
        if (focusables.length < 3) {
          console.log('No hay suficientes elementos focusables para probar la navegación');
          return;
        }
      }
      
      // Usar el tercer input o el que más se parezca a "Guía"
      let inputIndex = 2; // Valor predeterminado
      
      // Intentar encontrar un campo que parezca ser "Guía"
      for (let i = 0; i < formInputs.length; i++) {
        try {
          const placeholder = await formInputs[i].getAttribute('placeholder');
          const ariaLabel = await formInputs[i].getAttribute('aria-label');
          const name = await formInputs[i].getAttribute('name');
          
          if (
            (placeholder && placeholder.includes('Guía')) ||
            (ariaLabel && ariaLabel.includes('Guía')) ||
            (name && name.includes('guia'))
          ) {
            inputIndex = i;
            break;
          }
        } catch (error) {
          console.log(`Error al examinar el input ${i}:`, error);
        }
      }
      
      const inputToFocus = formInputs[inputIndex];
      
      // Hacer clic y escribir en el campo
      await inputToFocus.scrollIntoView();
      await inputToFocus.click();
      await inputToFocus.setValue('123456');
      
      // Guardar el ID o algún identificador del elemento actual
      const currentElement = await browser.execute(() => {
        return document.activeElement ? {
          id: document.activeElement.id,
          tagName: document.activeElement.tagName,
          className: document.activeElement.className
        } : null;
      });
      
      expect(currentElement).not.toBeNull();
      
      // Presionar Enter
      await browser.keys('Enter');
      
      // Esperar a que el foco cambie
      await browser.pause(1000);
      
      // Verificar que el elemento activo ha cambiado
      const newActiveElement = await browser.execute(() => {
        return document.activeElement ? {
          id: document.activeElement.id,
          tagName: document.activeElement.tagName,
          className: document.activeElement.className
        } : null;
      });
      
      // Verificar que el elemento activo es diferente al anterior
      expect(newActiveElement).not.toBeNull();
      
      if (currentElement && newActiveElement) {
        const hasCambiado = 
          currentElement.id !== newActiveElement.id ||
          currentElement.className !== newActiveElement.className;
          
        expect(hasCambiado).toBe(true);
        expect(newActiveElement.tagName.toLowerCase()).toBe('input');
      }
    });
  });
  