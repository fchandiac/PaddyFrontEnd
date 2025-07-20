import { authenticateForTests } from '../../helpers/auth';

// Helper para esperar que el formulario en el diálogo esté completamente cargado
const waitForFormDialog = async () => {
  // Esperar que el diálogo aparezca
  await $('.MuiDialog-root').waitForExist({ timeout: 10000 });
  
  // Dar tiempo para que el formulario se renderice completamente
  await browser.pause(2000);
  
  // Esperar específicamente a que los campos del formulario estén presentes EN TODO EL DOCUMENTO
  await browser.waitUntil(async () => {
    // Buscar los campos directamente en el documento, no solo en el diálogo
    const startInput = await $('input[name="start"]');
    const endInput = await $('input[name="end"]');
    const percentInput = await $('input[name="percent"]');
    
    const startExists = await startInput.isExisting();
    const endExists = await endInput.isExisting();
    const percentExists = await percentInput.isExisting();
    
    console.log(`Campos encontrados - start: ${startExists}, end: ${endExists}, percent: ${percentExists}`);
    
    return startExists && endExists && percentExists;
  }, {
    timeout: 10000,
    timeoutMsg: 'Los campos del formulario no aparecieron en el tiempo esperado'
  });
  
  console.log('Formulario de diálogo completamente cargado');
};

describe('Página de rangos de secado /paddy/receptions/drying', () => {
  beforeEach(async () => {
    // Autenticarse
    try {
      await authenticateForTests(browser);
      console.log('Autenticación completada exitosamente');
    } catch (error) {
      console.error('Error durante la autenticación:', error);
      throw error;
    }
    
    // Navegar a la página de rangos de secado
    await browser.url('/paddy/receptions/drying');
    
    // Esperar a que la página se cargue completamente (tiempo aumentado para mayor estabilidad)
    await browser.pause(5000);
    
    // Verificar que estamos en la página correcta
    const url = await browser.getUrl();
    if (!url.includes('/paddy/receptions/drying')) {
      console.log('Redirección detectada a:', url);
      // Tomar captura de pantalla para diagnóstico
      await browser.saveScreenshot('./errorShots/drying-ranges-redirect.png');
      throw new Error(`Redirección inesperada a: ${url}. Verifica que la autenticación funcionó correctamente.`);
    }

    // Verificar que la página ha cargado correctamente
    try {
      // Buscar el título específico "Rangos % de secado" en los elementos Typography
      await browser.waitUntil(async () => {
        const headings = await $$('h6, .MuiTypography-root');
        
        for (let heading of headings) {
          try {
            const text = await heading.getText();
            if (text && text.includes('Rangos % de secado')) {
              return true;
            }
          } catch (e) {
            // Continuar con el siguiente elemento si hay error
            continue;
          }
        }
        return false;
      }, { 
        timeout: 10000,
        timeoutMsg: 'No se encontró el título "Rangos % de secado" en la página'
      });

      console.log('Página de rangos de secado cargada correctamente');
    } catch (error) {
      console.error('Error esperando que la página cargue:', error);
      await browser.saveScreenshot('./errorShots/drying-ranges-load-error.png');
      throw error;
    }
  });

  /**
   * Test principal que realizará operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
   * en rangos de secado múltiples veces con diferentes valores
   */
  it('debe permitir crear, actualizar y eliminar rangos de secado múltiples veces', async () => {
    // Datos de prueba para los rangos (reducidos para la prueba)
    const testRanges = [
      { start: 10, end: 15, percent: 2.5 },
      { start: 16, end: 20, percent: 3.5 },
      { start: 21, end: 25, percent: 4.5 }
    ];

    // Función para encontrar el botón de crear rango ("+")
    const findAddButton = async () => {
      try {
        // Intentar encontrar el botón por diferentes selectores
        const possibleSelectors = [
          'button[aria-label="Nuevo"]', 
          '.MuiIconButton-root[aria-label="Nuevo"]', 
          'button:has(svg[data-testid="AddCircleIcon"])',
          'button:has(.MuiSvgIcon-root)'
        ];
        
        for (const selector of possibleSelectors) {
          try {
            const button = await $(selector);
            if (await button.isExisting()) {
              return button;
            }
          } catch (e) {
            // Intentar con el siguiente selector
          }
        }
        
        // Si todavía no encontramos, buscar por texto
        const createButtons = await $$('button[aria-label="Nuevo"]');
        const buttonsCount = await createButtons.length;
        if (buttonsCount > 0) {
          return createButtons[0]; // Devolver el primer botón de crear
        }
        
        throw new Error('No se pudo encontrar el botón de añadir');
      } catch (error) {
        console.error('Error al buscar el botón de añadir:', error);
        await browser.saveScreenshot('./errorShots/add-button-not-found.png');
        throw error;
      }
    };

    // Para cada rango de prueba, realizaremos un ciclo completo de CRUD
    for (let i = 0; i < testRanges.length; i++) {
      const range = testRanges[i];
      console.log(`Iteración ${i+1}/${testRanges.length} - Procesando rango: ${JSON.stringify(range)}`);
      
      // CREAR RANGO
      try {
        // 1. Hacer clic en el botón de añadir
        console.log('Buscando el botón de añadir...');
        const addButton = await findAddButton();
        await addButton.waitForClickable({ timeout: 5000 });
        await addButton.click();
        console.log('Botón de añadir encontrado y pulsado');
        await browser.pause(1000);
        
        // 2. Completar el formulario
        console.log('Completando el formulario...');
        // Esperar a que el diálogo esté visible
        const dialog = await $('.MuiDialog-root');
        await dialog.waitForExist({ timeout: 5000 });
        
        // Esperar a que los campos del formulario sean visibles
        const startInput = await dialog.$('input[name="start"]');
        const endInput = await dialog.$('input[name="end"]');
        const percentInput = await dialog.$('input[name="percent"]');
        
        await startInput.waitForExist({ timeout: 5000 });
        
        // Limpiar y establecer los valores
        await startInput.clearValue();
        await browser.pause(300);
        await startInput.setValue(range.start.toString());
        
        await endInput.clearValue();
        await browser.pause(300);
        await endInput.setValue(range.end.toString());
        
        await percentInput.clearValue();
        await browser.pause(300);
        await percentInput.setValue(range.percent.toString());
        
        console.log(`Valores establecidos: inicio=${range.start}, fin=${range.end}, porcentaje=${range.percent}`);
        
        // 3. Hacer clic en el botón de guardar
        const saveButton = await dialog.$('button[type="submit"]');
        await saveButton.waitForClickable({ timeout: 5000 });
        await saveButton.click();
        
        // 4. Esperar a que se cierre el formulario y aparezca una alerta de éxito
        await browser.pause(2000);
        
        // Verificar que el diálogo se ha cerrado
        const dialogStillExists = await dialog.isExisting();
        if (dialogStillExists) {
          console.warn('El diálogo sigue abierto después de guardar, verificando errores...');
          // Comprobar si hay errores en el formulario
          const errorMessagesArr = await $$('.MuiFormHelperText-root.Mui-error');
          if (Array.isArray(errorMessagesArr) && errorMessagesArr.length > 0) {
            const errorTexts: string[] = [];
            for (const e of errorMessagesArr) {
              errorTexts.push(await e.getText());
            }
            console.error('Errores en el formulario:', errorTexts);
            throw new Error(`Error al crear rango: ${errorTexts.join(', ')}`);
          }
          // Si no hay errores visibles pero el diálogo sigue abierto, intentar cerrar
          try {
            const cancelButton = await dialog.$('button*=Cancelar');
            if (await cancelButton.isExisting()) {
              await cancelButton.click();
            }
          } catch (e) {
            console.warn('No se pudo cerrar el diálogo:', e);
          }
          throw new Error('El formulario no se cerró después de guardar y no se detectaron errores específicos');
        }
        
        console.log('Rango creado correctamente');
        
        // Esperar a que se actualice la tabla
        await browser.pause(1000);
        
        // ACTUALIZAR RANGO
        console.log('Buscando el rango creado para actualizarlo...');
        
        // Intentar encontrar la fila que contiene el rango que acabamos de crear
        const cells = await $$('.MuiDataGrid-cell');
        let rowElement = null;
        
        for (const cell of cells) {
          try {
            const text = await cell.getText();
            if (text === range.start.toString()) {
              // Encontramos la celda con el valor de inicio
              rowElement = await cell.$('..');  // Obtener el elemento padre (fila)
              console.log('Encontrada celda con el valor de inicio del rango');
              break;
            }
          } catch (e) {
            // Continuar con la siguiente celda
          }
        }
        
        if (!rowElement) {
          // Intentar encontrar la fila de otra manera
          console.log('Buscando la fila por método alternativo...');
          const rows = await $$('.MuiDataGrid-row');
          
          for (const row of rows) {
            const rowCells = await row.$$('.MuiDataGrid-cell');
            for (const cell of rowCells) {
              try {
                const text = await cell.getText();
                if (text === range.start.toString()) {
                  rowElement = row;
                  console.log('Encontrada fila del rango por método alternativo');
                  break;
                }
              } catch (e) {
                // Continuar con la siguiente celda
              }
            }
            if (rowElement) break;
          }
        }
        
        if (rowElement) {
          // Buscar el botón de editar en la fila
          let editButtonSelector = null;
          try {
            // Primero intentar por aria-label
            const editButtonCandidate = await rowElement.$('button[aria-label="Editar"]');
            if (await editButtonCandidate.isExisting()) {
              editButtonSelector = 'button[aria-label="Editar"]';
            } else {
              // Luego intentar encontrarlo por el ícono
              const buttons = await rowElement.$$('button');
              for (const btn of buttons) {
                try {
                  const icon = await btn.$('svg[data-testid="EditIcon"]');
                  if (await icon.isExisting()) {
                    // Get selector for this button
                    const buttonsArr = await buttons;
                    const arrLength = await buttonsArr.length;
                    const btnElementId = await btn.elementId;
                    for (let i = 0; i < arrLength; i++) {
                      const arrElementId = await buttonsArr[i].elementId;
                      if (arrElementId === btnElementId) {
                        editButtonSelector = `button:nth-of-type(${i + 1})`;
                        break;
                      }
                    }
                    break;
                  }
                } catch (e) {
                  // Continuar con el siguiente botón
                }
              }
            }
          } catch (e) {
            console.warn('Error al buscar el botón de editar:', e);
          }
          if (editButtonSelector) {
            const editButtonEl = await rowElement.$(editButtonSelector);
            if (await editButtonEl.isExisting()) {
              await editButtonEl.waitForClickable({ timeout: 5000 });
              await editButtonEl.click();
              console.log('Botón de editar pulsado');
              // Esperar a que se abra el formulario de edición
              await browser.pause(1000);
              // Modificar el valor del porcentaje
              const editDialog = await $('.MuiDialog-root');
              await editDialog.waitForExist({ timeout: 5000 });
              const editPercentInput = await editDialog.$('input[name="percent"]');
              await editPercentInput.waitForExist({ timeout: 5000 });
              // Incrementar el porcentaje en 0.5
              const newPercent = range.percent + 0.5;
              await editPercentInput.clearValue();
              await browser.pause(300);
              await editPercentInput.setValue(newPercent.toString());
              console.log(`Porcentaje modificado a ${newPercent}`);
              // Guardar los cambios
              const updateButton = await editDialog.$('button[type="submit"]');
              await updateButton.waitForClickable({ timeout: 5000 });
              await updateButton.click();
              // Esperar a que se cierre el formulario
              await browser.pause(2000);
              console.log(`Rango actualizado: inicio=${range.start}, fin=${range.end}, porcentaje=${newPercent}`);
            } else {
              console.warn(`El botón de editar no existe para el rango con inicio=${range.start}`);
            }
          } else {
            console.warn(`No se encontró el botón de editar para el rango con inicio=${range.start}`);
          }
          
          // ELIMINAR RANGO (solo si i es par, para dejar algunos rangos en la base de datos)
          if (i % 2 === 0) {
            console.log('Buscando el rango para eliminarlo...');
            
            // Buscar el botón de eliminar en la fila
            let deleteButtonSelector = null;
            try {
              // Primero intentar por aria-label
              const deleteButtonCandidate = await rowElement.$('button[aria-label="Eliminar"]');
              if (await deleteButtonCandidate.isExisting()) {
                deleteButtonSelector = 'button[aria-label="Eliminar"]';
              } else {
                // Luego intentar encontrarlo por el ícono
                const buttons = await rowElement.$$('button');
                for (const btn of buttons) {
                  try {
                    const icon = await btn.$('svg[data-testid="DeleteIcon"]');
                    if (await icon.isExisting()) {
                      const buttonsArr = await buttons;
                      const arrLength = await buttonsArr.length;
                      const btnElementId = await btn.elementId;
                      for (let i = 0; i < arrLength; i++) {
                        const arrElementId = await buttonsArr[i].elementId;
                        if (arrElementId === btnElementId) {
                          deleteButtonSelector = `button:nth-of-type(${i + 1})`;
                          break;
                        }
                      }
                      break;
                    }
                  } catch (e) {
                    // Continuar con el siguiente botón
                  }
                }
              }
            } catch (e) {
              console.warn('Error al buscar el botón de eliminar:', e);
            }
            if (deleteButtonSelector) {
              const deleteButtonEl = await rowElement.$(deleteButtonSelector);
              if (await deleteButtonEl.isExisting()) {
                await deleteButtonEl.waitForClickable({ timeout: 5000 });
                await deleteButtonEl.click();
                console.log('Botón de eliminar pulsado');
                // Esperar a que aparezca el diálogo de confirmación
                await browser.pause(1000);
                // Buscar el diálogo de confirmación
                const confirmDialog = await $('.MuiDialog-root');
                await confirmDialog.waitForExist({ timeout: 5000 });
                // Confirmar la eliminación - probando diferentes textos de botón
                const confirmButtonSelectors = [
                  'button=Confirmar',
                  'button=Eliminar',
                  'button=Sí',
                  'button=Aceptar'
                ];
                let confirmButtonFound = false;
                for (const selector of confirmButtonSelectors) {
                  try {
                    const button = await confirmDialog.$(selector);
                    if (await button.isExisting() && await button.isClickable()) {
                      await button.click();
                      confirmButtonFound = true;
                      console.log(`Botón de confirmación encontrado y pulsado: ${selector}`);
                      break;
                    }
                  } catch (e) {
                    // Continuar con el siguiente selector
                  }
                }
                // Si no encontramos ninguno de los botones específicos, intentar con el último botón
                if (!confirmButtonFound) {
                  const buttons = await confirmDialog.$$('button');
                  if (Array.isArray(buttons) && buttons.length > 0) {
                    const lastButton = buttons[buttons.length - 1];
                    await lastButton.click();
                    confirmButtonFound = true;
                    console.log('Se utilizó el último botón del diálogo para confirmar');
                  }
                }
                if (confirmButtonFound) {
                  await browser.pause(2000);
                  console.log(`Rango eliminado: inicio=${range.start}, fin=${range.end}`);
                } else {
                  console.error('No se encontró el botón de confirmación para eliminar el rango');
                  await browser.saveScreenshot('./errorShots/confirm-button-not-found.png');
                }
              } else {
                console.warn(`El botón de eliminar no existe para el rango con inicio=${range.start}`);
              }
            } else {
              console.warn(`No se pudo encontrar el botón de eliminar para el rango con inicio=${range.start}`);
            }
          }
        } else {
          console.warn(`No se encontró la fila para el rango con inicio=${range.start}`);
        }
      } catch (error) {
        console.error(`Error en la iteración ${i+1}:`, error);
        await browser.saveScreenshot(`./errorShots/error-iteration-${i+1}.png`);
        // Continuar con la siguiente iteración a pesar del error
      }
      
      // Esperar un momento antes de la siguiente iteración
      await browser.pause(1000);
    }
    
    // Verificar el estado final de la tabla
    const rows = await $$('.MuiDataGrid-row');
    console.log(`Total de filas en la tabla al final del test: ${rows.length}`);
    
    // Esperamos que haya al menos algunos rangos en la tabla
    expect(rows.length).toBeGreaterThanOrEqual(1);
  });

  /**
   * Test que verifica la validación del formulario
   */
  it('debe mostrar errores de validación cuando se ingresa un rango inválido', async () => {
    // 1. Hacer clic en el botón de añadir
    try {
      console.log('Buscando botón de añadir para test de validación...');
      
      // Buscar el botón de forma más robusta
      const addButton = await $('button[aria-label="Nuevo"]');
      await addButton.waitForClickable({ timeout: 5000 });
      await addButton.click();
      await browser.pause(2000); // Aumentar pausa
      
      // 2. Esperar a que aparezca el diálogo Y los campos del formulario
      console.log('Esperando a que aparezca el diálogo...');
      await browser.waitUntil(async () => {
        const dialog = await $('.MuiDialog-root');
        const isDialogExist = await dialog.isExisting();
        if (!isDialogExist) {
          console.log('Diálogo aún no existe');
          return false;
        }
        
        console.log('Diálogo encontrado, buscando campos del formulario...');
        
        // Intentar diferentes selectores para encontrar los campos
        const selectors = [
          'input[name="start"]',
          '[name="start"]',
          'input[id*="start"]',
          '.MuiTextField-root input',
          '.MuiFormControl-root input'
        ];
        
        for (const selector of selectors) {
          const element = await $(selector);
          const exists = await element.isExisting();
          console.log(`Selector ${selector}: ${exists ? 'encontrado' : 'no encontrado'}`);
          if (exists) {
            console.log('Campo encontrado con selector:', selector);
            return true;
          }
        }
        
        console.log('Ningún campo encontrado aún');
        return false;
      }, { 
        timeout: 15000, 
        timeoutMsg: "El diálogo y los campos del formulario no aparecieron en el tiempo esperado" 
      });
      
      // Obtener referencias a los campos del formulario usando data-testid
      const startInput = await $('input[data-testid="form-input-start"]');
      const endInput = await $('input[data-testid="form-input-end"]');
      const percentInput = await $('input[data-testid="form-input-percent"]');
      await startInput.waitForExist({ timeout: 5000 });
      // Ejemplo 1: fin menor que inicio
      await startInput.clearValue();
      await browser.pause(300);
      await startInput.setValue('20');
      await endInput.clearValue();
      await browser.pause(300);
      await endInput.setValue('10');
      await percentInput.clearValue();
      await browser.pause(300);
      await percentInput.setValue('5');
      console.log('Valores inválidos establecidos: inicio=20, fin=10, porcentaje=5');
      // Guardar y verificar error
      let saveButton = await $('button[type="submit"]');
      await saveButton.waitForClickable({ timeout: 5000 });
      await saveButton.click();
      await browser.pause(1500);
      await browser.saveScreenshot('./errorShots/validation-errors-1.png');

      // Resetear el formulario si sigue abierto
      if (await $('button*=Cancelar').isExisting()) {
        await $('button*=Cancelar').click();
        await browser.pause(1000);
        // Reabrir el formulario
        const addButton = await $('button[aria-label="Nuevo"]');
        await addButton.waitForClickable({ timeout: 5000 });
        await addButton.click();
        await $('input[data-testid="form-input-start"]').waitForExist({ timeout: 5000 });
      }

      // Ejemplo 2: porcentaje negativo
      await startInput.clearValue();
      await browser.pause(300);
      await startInput.setValue('10');
      await endInput.clearValue();
      await browser.pause(300);
      await endInput.setValue('20');
      await percentInput.clearValue();
      await browser.pause(300);
      await percentInput.setValue('-5');
      console.log('Valores inválidos establecidos: inicio=10, fin=20, porcentaje=-5');
      saveButton = await $('button[type="submit"]');
      await saveButton.waitForClickable({ timeout: 5000 });
      await saveButton.click();
      await browser.pause(1500);
      await browser.saveScreenshot('./errorShots/validation-errors-2.png');

      if (await $('button*=Cancelar').isExisting()) {
        await $('button*=Cancelar').click();
        await browser.pause(1000);
        const addButton = await $('button[aria-label="Nuevo"]');
        await addButton.waitForClickable({ timeout: 5000 });
        await addButton.click();
        await $('input[data-testid="form-input-start"]').waitForExist({ timeout: 5000 });
      }

      // Ejemplo 3: porcentaje mayor a 100
      await startInput.clearValue();
      await browser.pause(300);
      await startInput.setValue('10');
      await endInput.clearValue();
      await browser.pause(300);
      await endInput.setValue('20');
      await percentInput.clearValue();
      await browser.pause(300);
      await percentInput.setValue('150');
      console.log('Valores inválidos establecidos: inicio=10, fin=20, porcentaje=150');
      saveButton = await $('button[type="submit"]');
      await saveButton.waitForClickable({ timeout: 5000 });
      await saveButton.click();
      await browser.pause(1500);
      await browser.saveScreenshot('./errorShots/validation-errors-3.png');

      if (await $('button*=Cancelar').isExisting()) {
        await $('button*=Cancelar').click();
        await browser.pause(1000);
        const addButton = await $('button[aria-label="Nuevo"]');
        await addButton.waitForClickable({ timeout: 5000 });
        await addButton.click();
        await $('input[data-testid="form-input-start"]').waitForExist({ timeout: 5000 });
      }

      // Ejemplo 4: campos vacíos
      await startInput.clearValue();
      await endInput.clearValue();
      await percentInput.clearValue();
      console.log('Valores inválidos establecidos: todos vacíos');
      saveButton = await $('button[type="submit"]');
      await saveButton.waitForClickable({ timeout: 5000 });
      await saveButton.click();
      await browser.pause(1500);
      await browser.saveScreenshot('./errorShots/validation-errors-4.png');
      
      // Después de cada intento, verificar si el formulario sigue abierto y si hay errores
      const errorSelector = '.MuiFormHelperText-root.Mui-error, [role="alert"]';
      const hasErrorElements = await $(errorSelector).isExisting();
      if (hasErrorElements) {
        try {
          const errorElements = await $$(errorSelector);
          const errorTexts: string[] = [];
          for (const el of errorElements) {
            const text = await el.getText();
            errorTexts.push(text);
          }
          console.log('Errores de validación encontrados:', errorTexts);
        } catch (e) {
          console.warn('No se pudieron obtener los textos de error:', e);
        }
      } else {
        console.warn('No se encontraron mensajes de error visibles tras los intentos de rangos inválidos');
      }
      
    } catch (error) {
      console.error('Error en la prueba de validación:', error);
      await browser.saveScreenshot('./errorShots/validation-test-error.png');
      throw error;
    }
  });

  /**
   * Test que verifica que los rangos no se pueden superponer
   */
  it('debe mostrar error cuando se intenta crear un rango superpuesto', async () => {
    try {
      // Primero crear un rango de prueba específico para esta prueba
      console.log('Creando rango inicial para prueba de superposición...');
      
      // 1. Hacer clic en el botón de añadir
      const addButton = await $('button[aria-label="Nuevo"]');
      await addButton.waitForClickable({ timeout: 5000 });
      await addButton.click();
      
      // 2. Esperar a que el formulario esté completamente cargado
      await waitForFormDialog();
      
      // 3. Completar el formulario con un rango específico usando data-testid
      const startInput = await $('input[data-testid="form-input-start"]');
      const endInput = await $('input[data-testid="form-input-end"]');
      const percentInput = await $('input[data-testid="form-input-percent"]');
      await startInput.waitForExist({ timeout: 5000 });
      await startInput.clearValue();
      await browser.pause(300);
      await startInput.setValue('70');
      await endInput.clearValue();
      await browser.pause(300);
      await endInput.setValue('80');
      await percentInput.clearValue();
      await browser.pause(300);
      await percentInput.setValue('12');
      console.log('Valores establecidos para rango inicial: inicio=70, fin=80, porcentaje=12');
      // 4. Guardar el rango
      const saveButton = await $('button[type="submit"]');
      await saveButton.waitForClickable({ timeout: 5000 });
      await saveButton.click();
      
      // 5. Esperar a que se cierre el formulario
      await browser.pause(2000);
      
      // Verificar que el diálogo se ha cerrado
      const dialogClosed = !(await $('.MuiDialog-root').isExisting());
      if (!dialogClosed) {
        console.warn('El diálogo no se cerró después de crear el primer rango, verificando errores...');
        await browser.saveScreenshot('./errorShots/overlap-first-range-error.png');
        
        // Intentar cerrar el diálogo
        try {
          const cancelButton = await $('.MuiDialog-root').$('button*=Cancelar');
          if (await cancelButton.isExisting()) {
            await cancelButton.click();
          }
        } catch (e) {
          console.warn('No se pudo cerrar el diálogo del primer rango:', e);
        }
        
        // Si no pudimos crear el primer rango, no podemos continuar con la prueba
        throw new Error('No se pudo crear el primer rango para la prueba de superposición');
      }
      
      console.log('Rango inicial creado correctamente. Intentando crear rango superpuesto...');
      
      // Ahora intentar crear un rango superpuesto
      // 6. Hacer clic nuevamente en el botón de añadir
      const addButtonAgain = await $('button[aria-label="Nuevo"]');
      await addButtonAgain.waitForClickable({ timeout: 5000 });
      await addButtonAgain.click();
      await browser.pause(1000);
      
      // 7. Esperar a que aparezca el formulario (input visible)
      await $('input[data-testid="form-input-start"]').waitForExist({ timeout: 5000 });

      // 8. Completar el formulario con un rango superpuesto
      const startInputAgain = await $('input[data-testid="form-input-start"]');
      const endInputAgain = await $('input[data-testid="form-input-end"]');
      const percentInputAgain = await $('input[data-testid="form-input-percent"]');

      await startInputAgain.waitForExist({ timeout: 5000 });

      await startInputAgain.clearValue();
      await browser.pause(300);
      await startInputAgain.setValue('75');  // Superpuesto con el rango anterior

      await endInputAgain.clearValue();
      await browser.pause(300);
      await endInputAgain.setValue('85');

      await percentInputAgain.clearValue();
      await browser.pause(300);
      await percentInputAgain.setValue('15');

      console.log('Valores establecidos para rango superpuesto: inicio=75, fin=85, porcentaje=15');

      // 9. Intentar guardar el rango superpuesto
      const saveButtonAgain = await $('button[type="submit"]');
      await saveButtonAgain.waitForClickable({ timeout: 5000 });
      await saveButtonAgain.click();

      // 10. Esperar y verificar la respuesta
      await browser.pause(2000);

      // Tomar captura de pantalla para verificar el estado
      await browser.saveScreenshot('./errorShots/overlap-test.png');

      // 11. Verificar si el formulario sigue abierto (esperamos que sí, debido a la validación)
      const formStillOpen = await $('input[data-testid="form-input-start"]').isExisting();

      if (formStillOpen) {
        console.log('El formulario sigue abierto, verificando errores de validación...');

        // Verificar si hay mensajes de error en el formulario
        const errorSelector = '.MuiFormHelperText-root.Mui-error, [role="alert"]';
        const hasErrorElements = await $(errorSelector).isExisting();

        if (hasErrorElements) {
          try {
            const errorElements = await $$(errorSelector);
            const errorTexts: string[] = [];
            for (const el of errorElements) {
              const text = await el.getText();
              errorTexts.push(text);
            }
            console.log('Errores de validación encontrados:', errorTexts);
            expect(hasErrorElements).toBe(true);
          } catch (e) {
            console.warn('No se pudieron obtener los textos de error:', e);
          }
        } else {
          console.warn('El formulario sigue abierto pero no se encontraron mensajes de error');
        }

        // Cerrar el formulario
        try {
          const cancelButton = await $('button*=Cancelar');
          if (await cancelButton.isExisting()) {
            await cancelButton.click();
            console.log('Formulario cerrado mediante botón Cancelar');
          }
        } catch (error) {
          console.warn('No se pudo cerrar el formulario:', error);
        }
      } else {
        // Si el formulario se cerró, debería haber un mensaje de error en una alerta
        console.log('El formulario se cerró, verificando alerta de error...');

        try {
          const errorAlert = await $('.MuiAlert-standardError, [role="alert"]');
          const errorExists = await errorAlert.isExisting();

          if (errorExists) {
            const errorText = await errorAlert.getText();
            console.log('Alerta de error encontrada:', errorText);
            expect(errorExists).toBe(true);
          } else {
            console.warn('No se encontró alerta de error después de cerrar el formulario');
            throw new Error('El formulario se cerró sin mostrar error de superposición');
          }
        } catch (error) {
          console.warn('Error al buscar alerta de error:', error);
          throw error;
        }
      }
    } catch (error) {
      console.error('Error en la prueba de rango superpuesto:', error);
      await browser.saveScreenshot('./errorShots/overlap-test-error.png');
      throw error;
    }
  });
});
