import { authenticateForTests } from '../../helpers/auth';
import { findAvailableRange, generateTestRanges } from '../../helpers/dryingRangeUtils';

// Variables para control visual de las pruebas
const VISUAL_MODE = process.env.TEST_MODE === 'VISUAL';
const SLOW_MOTION = parseInt(process.env.TEST_SLOW_MOTION || '0', 10); // Pausa entre acciones

// Helper para esperar que el formulario en el diálogo esté completamente cargado
const waitForFormDialog = async () => {
  // Esperar que el diálogo aparezca
  await $('.MuiDialog-root').waitForExist({ timeout: 10000 });
  
  // Dar tiempo para que el formulario se renderice completamente
  await browser.pause(2000);
  
  // Esperar específicamente a que los campos del formulario estén presentes
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

// Función para obtener los rangos de la tabla una vez en la página
async function getRangesFromTable() {
  try {
    // Esperar a que la tabla se cargue
    await $('.MuiDataGrid-root').waitForExist({ timeout: 10000 });
    await browser.pause(2000);
    
    // Obtener todas las filas de la tabla
    const rows = await $$('.MuiDataGrid-row');
    const rowCount = await rows.length;
    console.log(`Encontradas ${rowCount} filas en la tabla`);
    
    const ranges: Array<{start: number, end: number, percent: number}> = [];
    
    // Si no hay filas, devolver array vacío
    if (rowCount === 0) {
      return ranges;
    }
    
    // Método alternativo para obtener datos de celdas directamente
    try {
      // Obtener celdas directamente desde la tabla
      const allCells = await $$('.MuiDataGrid-cell');
      const allCellsCount = await allCells.length;
      
      // Si no hay celdas, devolver array vacío
      if (allCellsCount === 0) {
        console.log('No se encontraron celdas en la tabla');
        return ranges;
      }
      
      // Asumiendo que la estructura es:
      // Cada fila tiene 7 celdas: ID, start, end, percent, etc.
      const cellsPerRow = 7;
      
      // Para cada fila
      for (let i = 0; i < rowCount; i++) {
        try {
          const startIndex = i * cellsPerRow + 1; // índice de la celda 'start'
          const endIndex = i * cellsPerRow + 2;   // índice de la celda 'end'
          const percentIndex = i * cellsPerRow + 3; // índice de la celda 'percent'
          
          if (startIndex < allCellsCount && 
              endIndex < allCellsCount && 
              percentIndex < allCellsCount) {
            
            const startCell = allCells[startIndex];
            const endCell = allCells[endIndex];
            const percentCell = allCells[percentIndex];
            
            // Obtener los textos de las celdas
            const startText = await startCell.getText();
            const endText = await endCell.getText();
            const percentText = await percentCell.getText();
            
            console.log(`Fila ${i+1}: start=${startText}, end=${endText}, percent=${percentText}`);
            
            // Convertir a números
            const start = parseFloat(startText);
            const end = parseFloat(endText);
            const percent = parseFloat(percentText);
            
            if (!isNaN(start) && !isNaN(end) && !isNaN(percent)) {
              ranges.push({ start, end, percent });
            }
          }
        } catch (error) {
          console.error(`Error al procesar fila ${i+1}:`, error);
        }
      }
      
      console.log(`Rangos recuperados de la tabla: ${JSON.stringify(ranges)}`);
      return ranges;
    } catch (error) {
      console.error('Error obteniendo celdas de la tabla:', error);
      return [];
    }
  } catch (error) {
    console.error('Error al obtener rangos de la tabla:', error);
    return [];
  }
}

// Función para llenar el formulario con los valores proporcionados
async function fillFormAndSubmit(start: number, end: number, percent: number, expectError = false) {
  console.log(`Llenando formulario con start=${start}, end=${end}, percent=${percent}`);
  
  // Esperar a que el formulario esté completamente cargado
  await waitForFormDialog();
  
  // Llenar los campos
  const startInput = await $('input[name="start"]');
  const endInput = await $('input[name="end"]');
  const percentInput = await $('input[name="percent"]');
  
  // Limpiar los campos antes de establecer valores
  await startInput.clearValue();
  await browser.pause(300);
  await startInput.setValue(start.toString());
  
  await endInput.clearValue();
  await browser.pause(300);
  await endInput.setValue(end.toString());
  
  await percentInput.clearValue();
  await browser.pause(300);
  await percentInput.setValue(percent.toString());
  
  // Modo visual: Pausa para ver el formulario completado
  if (VISUAL_MODE) {
    await browser.pause(2000);
  }
  
  // Hacer clic en el botón Guardar
  const saveButton = await $('.MuiDialog-root button[type="submit"]');
  await saveButton.waitForClickable({ timeout: 5000 });
  await saveButton.click();
  
  // Si esperamos un error, verificar que aparezca un mensaje de error
  if (expectError) {
    try {
      // Esperar a que aparezca un mensaje de error
      const errorElement = await $('.MuiFormHelperText-root.Mui-error, [role="alert"]');
      await errorElement.waitForExist({ timeout: 5000 });
      
      // Obtener el texto del error para validación
      try {
        const errorText = await errorElement.getText();
        console.log(`Mensaje de error detectado: "${errorText}"`);
        
        // Tomar captura de pantalla para diagnóstico
        await browser.saveScreenshot('./errorShots/validation-error.png');
        return errorText;
      } catch (e) {
        console.error('Error al obtener texto del error:', e);
        return 'Error al obtener texto del error';
      }
    } catch (error) {
      console.error('Error al esperar mensaje de error:', error);
      
      // Buscar mensajes de error visibles (forma alternativa)
      try {
        const errorMessages = await $$('.MuiFormHelperText-root.Mui-error, [role="alert"]');
        const messageCount = await errorMessages.length;
        
        if (messageCount > 0) {
          for (const error of errorMessages) {
            try {
              console.error(`Error encontrado: ${await error.getText()}`);
            } catch (e: any) {
              console.error('Error al obtener texto del error:', e.message);
            }
          }
        }
      } catch (e: any) {
        console.error('Error al buscar mensajes de error:', e.message);
      }
      
      throw new Error('No se encontró mensaje de error aunque se esperaba uno');
    }
  } else {
    // Si no esperamos error, esperar a que el diálogo se cierre
    try {
      await browser.waitUntil(
        async () => {
          const dialog = await $('.MuiDialog-root');
          return !(await dialog.isExisting());
        },
        {
          timeout: 10000,
          timeoutMsg: 'El diálogo no se cerró después de hacer clic en Guardar',
          interval: 500,
        }
      );
      console.log('Diálogo cerrado correctamente');
    } catch (error) {
      console.error('Error al esperar que el diálogo se cierre:', error);
      
      // Intentar obtener cualquier mensaje de error visible
      try {
        const errorElements = await $$('.MuiFormHelperText-root.Mui-error, [role="alert"]');
        for (const element of errorElements) {
          const text = await element.getText();
          console.log(`Mensaje de error encontrado: "${text}"`);
        }
      } catch (e) {
        // Ignorar errores al buscar mensajes
      }
      
      // Tomar captura de pantalla para diagnóstico
      await browser.saveScreenshot('./errorShots/form-submit-error.png');
      throw new Error('El diálogo no se cerró después de hacer clic en Guardar');
    }
    
    return null;
  }
}

// Función para encontrar el botón de añadir
async function findAddButton(): Promise<WebdriverIO.Element | null> {
  try {
    const possibleSelectors = [
      'button[aria-label="Nuevo"]', 
      'button[aria-label="add"]',
      '.MuiIconButton-root[aria-label="Nuevo"]', 
      'button:has(svg[data-testid="AddCircleIcon"])',
      'button:has(.MuiSvgIcon-root)'
    ];

    for (const selector of possibleSelectors) {
      try {
        const button = await $(selector);
        if (await button.isExisting()) {
          return button as unknown as WebdriverIO.Element;
        }
      } catch (error) {
        // Ignore errors for non-existing selectors
      }
    }
  } catch (error) {
    console.error('Error finding add button:', error);
  }
  return null;
}

// Suite principal de pruebas
describe('Rangos de secado - CRUD y validaciones', () => {
  // Antes de todas las pruebas, realizar el login
  before(async () => {
    try {
      await authenticateForTests(browser);
      console.log('Login completado exitosamente');
    } catch (error) {
      console.error('Error durante el login:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    // Navegar a la página de rangos de secado
    await browser.url('/paddy/receptions/drying');
    
    // Esperar a que la página se cargue completamente
    await browser.pause(5000);
    
    // Verificar que estamos en la página correcta buscando el título
    try {
      // Buscar el título específico "Rangos % de secado" en los elementos Typography
      await browser.waitUntil(async () => {
        const headings = await $$('h6, .MuiTypography-root, h4, .MuiTypography-h4');

        for (let heading of headings) {
          try {
            const text = await heading.getText();
            if (text && (text.includes('Rangos') || text.includes('secado'))) {
              return true;
            }
          } catch (e) {
            // Continuar con el siguiente elemento si hay error
            continue;
          }
        }
        return false;
      }, {
        timeout: 15000,
        timeoutMsg: 'No se encontró el título de la página después de 15 segundos',
        interval: 1000
      });

      console.log('Página de rangos de secado cargada correctamente');
    } catch (error) {
      console.error('Error esperando que la página cargue:', error);
      await browser.saveScreenshot('./errorShots/drying-ranges-load-error.png');
      throw error;
    }
  });

  // TEST 1: CREAR UN RANGO QUE NO SE SOLAPE CON LOS EXISTENTES
  it('debe crear un nuevo rango que no se solape con los existentes', async () => {
    try {
      // Obtener rangos existentes
      const existingRanges = await getRangesFromTable();
      console.log(`Rangos existentes: ${JSON.stringify(existingRanges)}`);
      
      // Encontrar un rango disponible
      const newRange = findAvailableRange(existingRanges);
      console.log(`Usando rango disponible: inicio=${newRange.start}, fin=${newRange.end}, porcentaje=${newRange.percent}`);
      
      // Hacer clic en el botón de añadir
      const addButton = await findAddButton();
      if (!addButton) {
        throw new Error('Add button not found');
      }
      await addButton.click();
      await browser.pause(1000);
      
      // Llenar el formulario y enviarlo
      await fillFormAndSubmit(newRange.start, newRange.end, newRange.percent);
      
      // Esperar a que la tabla se actualice
      await browser.pause(2000);
      
      // Verificar que el rango se ha añadido a la tabla
      // Buscar la celda que contiene el valor de inicio del rango
      const startCell = await $(`.MuiDataGrid-cell*=${newRange.start}`);
      const startCellExists = await startCell.isExisting();
      
      // Buscar la celda que contiene el valor de fin del rango
      const endCell = await $(`.MuiDataGrid-cell*=${newRange.end}`);
      const endCellExists = await endCell.isExisting();
      
      // Verificar que ambas celdas existen
      expect(startCellExists).toBe(true);
      expect(endCellExists).toBe(true);
      
      console.log('Rango creado y verificado correctamente');
      
    } catch (error) {
      console.error('Error en la prueba de creación de rango:', error);
      await browser.saveScreenshot('./errorShots/create-range-test-error.png');
      throw error;
    }
  });

  // TEST 2: VALIDACIÓN DE SOLAPAMIENTO
  it('debe fallar al intentar crear un rango que se solapa con uno existente', async () => {
    try {
      // Obtener rangos existentes
      let existingRanges = await getRangesFromTable();
      console.log(`Rangos existentes: ${JSON.stringify(existingRanges)}`);
      
      // Asegurarse de que hay rangos existentes para probar
      if (existingRanges.length === 0) {
        console.warn('No hay rangos existentes para probar solapamiento, creando uno primero...');
        
        // Crear un rango de prueba a través de la UI
        const testRange = { 
          start: 50, 
          end: 60, 
          percent: 15 
        };
        
        // Hacer clic en el botón de añadir
        const addButton = await findAddButton();
        if (!addButton) {
          throw new Error('Add button not found');
        }
        await addButton.click();
        await browser.pause(1000);
        
        // Llenar el formulario y enviarlo
        await fillFormAndSubmit(testRange.start, testRange.end, testRange.percent);
        
        // Esperar a que la tabla se actualice
        await browser.pause(2000);
        
        // Actualizar la lista de rangos existentes
        existingRanges.push(testRange);
      }
      
      // Tomar un rango existente para crear uno que se solape
      // Necesitamos tener al menos un rango existente para probar
      if (existingRanges.length === 0) {
        console.log("No se encontraron rangos existentes después de crear uno. Usando un rango predeterminado para el test");
        // Crear un rango predeterminado de prueba
        existingRanges = [{
          start: 50,
          end: 60,
          percent: 15
        }];
      }
      
      const existingRange = existingRanges[0];
      console.log(`Usando rango existente para solapamiento: inicio=${existingRange.start}, fin=${existingRange.end}`);
      
      // Crear un rango que se solape
      const overlappingRange = {
        start: existingRange.start + 2,
        end: existingRange.end + 2,
        percent: 10
      };
      
      console.log(`Intentando crear rango superpuesto: inicio=${overlappingRange.start}, fin=${overlappingRange.end}, porcentaje=${overlappingRange.percent}`);
      
      // Hacer clic en el botón de añadir
      const addButton = await findAddButton();
      if (!addButton) {
        throw new Error('Add button not found');
      }
      await addButton.click();
      await browser.pause(1000);
      
      // Llenar el formulario y enviarlo, esperando error
      const errorText = await fillFormAndSubmit(overlappingRange.start, overlappingRange.end, overlappingRange.percent, true);
      
      // Verificar que se muestra un mensaje de error
      expect(errorText).toBeTruthy();
      
      // Verificar que el mensaje contenga información sobre el error de solapamiento
      expect(errorText?.toLowerCase()).toMatch(/solapa|superpuesto|existente|rango|solapado|overlap/i);
      
      console.log('Prueba de validación de solapamiento completada exitosamente');
      
    } catch (error) {
      console.error('Error en la prueba de validación de solapamiento:', error);
      await browser.saveScreenshot('./errorShots/overlap-validation-test-error.png');
      throw error;
    }
  });

  // TEST 3: ACTUALIZAR UN RANGO EXISTENTE
  it('debe actualizar correctamente un rango existente', async () => {
    try {
      // Obtener rangos existentes
      const existingRanges = await getRangesFromTable();
      console.log(`Rangos existentes: ${JSON.stringify(existingRanges)}`);
      
      // Asegurarse de que hay rangos existentes para actualizar
      if (existingRanges.length === 0) {
        console.warn('No hay rangos existentes para actualizar, creando uno primero...');
        
        // Crear un rango de prueba a través de la UI
        const testRange = { 
          start: 30, 
          end: 40, 
          percent: 10 
        };
        
        // Hacer clic en el botón de añadir
        const addButton = await findAddButton();
        if (!addButton) {
          throw new Error('Add button not found');
        }
        await addButton.click();
        await browser.pause(1000);
        
        // Llenar el formulario y enviarlo
        await fillFormAndSubmit(testRange.start, testRange.end, testRange.percent);
        
        // Esperar a que la tabla se actualice
        await browser.pause(2000);
        
        // Actualizar la lista de rangos existentes
        existingRanges.push(testRange);
      }
      
      // Tomar el primer rango existente para actualizarlo
      const rangeToUpdate = existingRanges[0];
      console.log(`Usando rango para actualizar: inicio=${rangeToUpdate.start}, fin=${rangeToUpdate.end}, porcentaje=${rangeToUpdate.percent}`);
      
      // Intentar encontrar la fila que contiene el rango
      const cells = await $$('.MuiDataGrid-cell');
      let rowElement = null;
      
      for (const cell of cells) {
        try {
          const text = await cell.getText();
          if (text === rangeToUpdate.start.toString()) {
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
              if (text === rangeToUpdate.start.toString()) {
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
            // Intentar con otros selectores comunes
            const possibleSelectors = [
              'button[aria-label="edit"]',
              'button:has(svg[data-testid="EditIcon"])'
            ];
            
            for (const selector of possibleSelectors) {
              try {
                const button = await rowElement.$(selector);
                if (await button.isExisting()) {
                  editButtonSelector = selector;
                  break;
                }
              } catch (e) {
                // Intentar con el siguiente selector
              }
            }
            
            // Si todavía no encontramos, buscar todos los botones
            if (!editButtonSelector) {
              const buttons = await rowElement.$$('button');
              for (const btn of buttons) {
                try {
                  const icon = await btn.$('svg');
                  if (await icon.isExisting()) {
                    // Verificar si este botón parece ser el de editar
                    const dataTestId = await icon.getAttribute('data-testid');
                    if (dataTestId && dataTestId.includes('Edit')) {
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
                  }
                } catch (e) {
                  // Continuar con el siguiente botón
                }
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
            const newPercent = rangeToUpdate.percent + 0.5;
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
            
            // Verificar que el diálogo se ha cerrado
            const dialogClosed = !(await $('.MuiDialog-root').isExisting());
            
            if (!dialogClosed) {
              console.warn('El formulario no se cerró, verificando posibles errores...');
              
              // Capturar pantalla para diagnóstico
              await browser.saveScreenshot('./errorShots/update-form-error.png');
              
              // Buscar mensajes de error
              try {
                const errorMessages = await $$('.MuiFormHelperText-root.Mui-error, [role="alert"]');
                const messageCount = await errorMessages.length;
                
                if (messageCount > 0) {
                  for (const error of errorMessages) {
                    try {
                      console.error(`Error encontrado: ${await error.getText()}`);
                    } catch (e: any) {
                      console.error('Error al obtener texto del error:', e.message);
                    }
                  }
                }
              } catch (e: any) {
                console.error('Error al buscar mensajes de error:', e.message);
              }
              
              throw new Error('El formulario no se cerró después de guardar');
            }
            
            console.log(`Rango actualizado: inicio=${rangeToUpdate.start}, fin=${rangeToUpdate.end}, porcentaje=${newPercent}`);
            
            // Esperar a que la tabla se actualice
            await browser.pause(2000);
            
            // Verificar que el porcentaje se ha actualizado
            const updatedRanges = await getRangesFromTable();
            const updatedRange = updatedRanges.find(r => 
              r.start === rangeToUpdate.start && 
              r.end === rangeToUpdate.end
            );
            
            expect(updatedRange).toBeTruthy();
            if (updatedRange) {
              // Verificar con tolerancia para números de punto flotante
              expect(Math.abs(updatedRange.percent - newPercent) < 0.1).toBe(true);
            }
            
          } else {
            console.warn(`El botón de editar no existe para el rango con inicio=${rangeToUpdate.start}`);
            throw new Error('No se encontró el botón de editar');
          }
        } else {
          console.warn(`No se encontró el botón de editar para el rango con inicio=${rangeToUpdate.start}`);
          throw new Error('No se encontró el botón de editar');
        }
      } else {
        console.warn(`No se encontró la fila para el rango con inicio=${rangeToUpdate.start}`);
        throw new Error('No se encontró la fila para el rango seleccionado');
      }
      
    } catch (error) {
      console.error('Error en la prueba de actualización de rango:', error);
      await browser.saveScreenshot('./errorShots/update-range-test-error.png');
      throw error;
    }
  });

  // TEST 4: VALIDACIÓN DE CAMPO START MAYOR QUE END
  it('debe fallar al intentar crear un rango con start mayor que end', async () => {
    try {
      // Hacer clic en el botón de añadir
      const addButton = await findAddButton();
      if (!addButton) {
        throw new Error('Add button not found');
      }
      await addButton.click();
      await browser.pause(1000);
      
      // Llenar el formulario con start mayor que end
      const errorText = await fillFormAndSubmit(30, 20, 5, true);
      
      // Verificar que se muestra un mensaje de error
      expect(errorText).toBeTruthy();
      
      // Verificar que el mensaje contenga información sobre el error
      expect(errorText?.toLowerCase()).toMatch(/mayor|menor|start|end|inicio|fin/i);
      
    } catch (error) {
      console.error('Error en la prueba de validación start > end:', error);
      await browser.saveScreenshot('./errorShots/start-end-validation-error.png');
      throw error;
    }
  });

  // TEST 5: VALIDACIÓN DE CAMPOS VACÍOS
  it('debe fallar al intentar crear un rango con campos vacíos', async () => {
    try {
      // Hacer clic en el botón de añadir
      const addButton = await findAddButton();
      if (!addButton) {
        throw new Error('Add button not found');
      }
      await addButton.click();
      await browser.pause(1000);
      
      // Esperar a que el formulario esté completamente cargado
      await waitForFormDialog();
      
      // Hacer clic en el botón Guardar sin llenar los campos
      const saveButton = await $('.MuiDialog-root button[type="submit"]');
      await saveButton.waitForClickable({ timeout: 5000 });
      await saveButton.click();
      
      // Esperar a que aparezcan mensajes de error
      const errorElements = await $$('.MuiFormHelperText-root.Mui-error');
      await browser.waitUntil(
        async () => (await errorElements.length) > 0,
        {
          timeout: 5000,
          timeoutMsg: 'No se encontraron mensajes de error para campos vacíos',
          interval: 500,
        }
      );
      
      // Verificar que hay al menos un mensaje de error
      expect(await errorElements.length).toBeGreaterThan(0);
      
      // Verificar que el diálogo sigue abierto
      const dialog = await $('.MuiDialog-root');
      expect(await dialog.isExisting()).toBe(true);
      
      // Obtener los mensajes de error
      for (const error of errorElements) {
        console.log(`Error de validación: ${await error.getText()}`);
      }
      
      // Cerrar el diálogo
      try {
        const cancelButton = await $('button=Cancelar');
        if (await cancelButton.isExisting()) {
          await cancelButton.click();
        } else {
          // Intentar con otros selectores si no se encuentra el botón Cancelar
          const dialogButtons = await $$('.MuiDialog-root button');
          for (const btn of dialogButtons) {
            const text = await btn.getText();
            if (text.includes('Cancel') || text === 'Cerrar' || text === 'Cancelar') {
              await btn.click();
              break;
            }
          }
        }
      } catch (e) {
        console.warn('No se pudo cerrar el diálogo:', e);
      }
      
    } catch (error) {
      console.error('Error en la prueba de validación de campos vacíos:', error);
      await browser.saveScreenshot('./errorShots/empty-fields-validation-error.png');
      throw error;
    }
  });

  // TEST 6: VALIDACIÓN DE VALORES NEGATIVOS
  it('debe fallar al intentar crear un rango con valores negativos', async () => {
    try {
      // Hacer clic en el botón de añadir
      const addButton = await findAddButton();
      if (!addButton) {
        throw new Error('Add button not found');
      }
      await addButton.click();
      await browser.pause(1000);
      
      // Llenar el formulario con valores negativos
      const errorText = await fillFormAndSubmit(-10, -5, 5, true);
      
      // Verificar que se muestra un mensaje de error
      expect(errorText).toBeTruthy();
      
      // Verificar que el mensaje contenga información sobre el error
      expect(errorText?.toLowerCase()).toMatch(/negativ|mayor|cero|positive/i);
      
    } catch (error) {
      console.error('Error en la prueba de validación de valores negativos:', error);
      await browser.saveScreenshot('./errorShots/negative-values-validation-error.png');
      throw error;
    }
  });

  // TEST 7: VALIDACIÓN DE PORCENTAJE FUERA DE RANGO
  it('debe fallar al intentar crear un rango con porcentaje fuera de límites', async () => {
    try {
      // Hacer clic en el botón de añadir
      const addButton = await findAddButton();
      if (!addButton) {
        throw new Error('Add button not found');
      }
      await addButton.click();
      await browser.pause(1000);
      
      // Llenar el formulario con porcentaje negativo
      let errorText = await fillFormAndSubmit(10, 20, -5, true);
      
      // Verificar que se muestra un mensaje de error
      expect(errorText).toBeTruthy();
      
      // Verificar que el mensaje contenga información sobre el error de porcentaje
      expect(errorText?.toLowerCase()).toMatch(/porcent|percent|negativ/i);
      
      // Intentar con porcentaje mayor al límite permitido
      // Primero debemos cancelar el diálogo actual
      try {
        const cancelButton = await $('.MuiDialog-root button:not([type="submit"])');
        await cancelButton.click();
        
        // Esperar a que el diálogo se cierre
        await browser.waitUntil(
          async () => {
            const dialog = await $('.MuiDialog-root');
            return !(await dialog.isExisting());
          },
          {
            timeout: 5000,
            timeoutMsg: 'El diálogo no se cerró después de hacer clic en Cancelar',
            interval: 500,
          }
        );
      } catch (error) {
        console.error('Error al cerrar el diálogo:', error);
      }
      
      // Abrir el formulario nuevamente
      if (!addButton) {
        throw new Error('Add button not found');
      }
      await addButton.click();
      await browser.pause(1000);
      
      // Llenar el formulario con porcentaje muy alto (por ejemplo, 101%)
      errorText = await fillFormAndSubmit(10, 20, 101, true);
      
      // Verificar que se muestra un mensaje de error
      expect(errorText).toBeTruthy();
      
      // Verificar que el mensaje contenga información sobre el error de porcentaje
      expect(errorText?.toLowerCase()).toMatch(/porcent|percent|máximo|maximum/i);
      
    } catch (error) {
      console.error('Error en la prueba de validación de porcentaje fuera de límites:', error);
      await browser.saveScreenshot('./errorShots/percent-range-validation-error.png');
      throw error;
    }
  });

  // TEST 8: ELIMINAR UN RANGO
  it('debe eliminar un rango correctamente', async () => {
    try {
      // Obtener rangos existentes
      const existingRanges = await getRangesFromTable();
      console.log(`Rangos existentes: ${JSON.stringify(existingRanges)}`);
      
      // Asegurarse de que hay rangos existentes para eliminar
      if (existingRanges.length === 0) {
        console.warn('No hay rangos existentes para eliminar, creando uno primero...');
        
        // Crear un rango de prueba a través de la UI
        const testRange = { 
          start: 70, 
          end: 80, 
          percent: 20 
        };
        
        // Hacer clic en el botón de añadir
        const addButton = await findAddButton();
        if (!addButton) {
          throw new Error('Add button not found');
        }
        await addButton.click();
        await browser.pause(1000);
        
        // Llenar el formulario y enviarlo
        await fillFormAndSubmit(testRange.start, testRange.end, testRange.percent);
        
        // Esperar a que la tabla se actualice
        await browser.pause(2000);
        
        // Actualizar la lista de rangos existentes
        existingRanges.push(testRange);
      }
      
      // Tomar el primer rango existente para eliminarlo
      const rangeToDelete = existingRanges[0];
      console.log(`Usando rango para eliminar: inicio=${rangeToDelete.start}, fin=${rangeToDelete.end}, porcentaje=${rangeToDelete.percent}`);
      
      // Intentar encontrar la fila que contiene el rango
      const cells = await $$('.MuiDataGrid-cell');
      let rowElement = null;
      
      for (const cell of cells) {
        try {
          const text = await cell.getText();
          if (text === rangeToDelete.start.toString()) {
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
              if (text === rangeToDelete.start.toString()) {
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
        // Buscar el botón de eliminar en la fila
        let deleteButtonSelector = null;
        try {
          // Primero intentar por aria-label
          const deleteButtonCandidate = await rowElement.$('button[aria-label="Eliminar"]');
          if (await deleteButtonCandidate.isExisting()) {
            deleteButtonSelector = 'button[aria-label="Eliminar"]';
          } else {
            // Intentar con otros selectores comunes
            const possibleSelectors = [
              'button[aria-label="delete"]',
              'button:has(svg[data-testid="DeleteIcon"])'
            ];
            
            for (const selector of possibleSelectors) {
              try {
                const button = await rowElement.$(selector);
                if (await button.isExisting()) {
                  deleteButtonSelector = selector;
                  break;
                }
              } catch (e) {
                // Intentar con el siguiente selector
              }
            }
            
            // Si todavía no encontramos, buscar todos los botones
            if (!deleteButtonSelector) {
              const buttons = await rowElement.$$('button');
              for (const btn of buttons) {
                try {
                  const icon = await btn.$('svg');
                  if (await icon.isExisting()) {
                    // Verificar si este botón parece ser el de eliminar
                    const dataTestId = await icon.getAttribute('data-testid');
                    if (dataTestId && dataTestId.includes('Delete')) {
                      // Get selector for this button
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
                  }
                } catch (e) {
                  // Continuar con el siguiente botón
                }
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
            const confirmDialog = await $('.MuiDialog-root');
            await confirmDialog.waitForExist({ timeout: 5000 });
            
            // Confirmar la eliminación
            const confirmButton = await $('button=Aceptar') || await $('button=Eliminar') || await $('button=Sí');
            if (await confirmButton.isExisting()) {
              await confirmButton.waitForClickable({ timeout: 5000 });
              await confirmButton.click();
              console.log('Confirmación de eliminación realizada');
            } else {
              // Intentar con otros selectores si no se encuentra el botón de confirmación
              const dialogButtons = await $$('.MuiDialog-root button');
              let confirmButtonFound = false;
              for (const btn of dialogButtons) {
                const text = await btn.getText();
                if (text.includes('Aceptar') || text.includes('Eliminar') || text.includes('Sí') || 
                    text.includes('OK') || text.includes('Delete') || text.includes('Yes')) {
                  await btn.click();
                  confirmButtonFound = true;
                  console.log(`Botón de confirmación encontrado: ${text}`);
                  break;
                }
              }
              
              if (!confirmButtonFound) {
                throw new Error('No se encontró el botón de confirmación para eliminar');
              }
            }
            
            // Esperar a que se cierre el diálogo y se actualice la tabla
            await browser.pause(2000);
            
            // Verificar que el rango se ha eliminado comprobando que ya no existe en la tabla
            const updatedRanges = await getRangesFromTable();
            const rangeStillExists = updatedRanges.some(r => 
              r.start === rangeToDelete.start && 
              r.end === rangeToDelete.end
            );
            
            expect(rangeStillExists).toBe(false);
            console.log('Rango eliminado correctamente');
            
          } else {
            console.warn(`El botón de eliminar no existe para el rango con inicio=${rangeToDelete.start}`);
            throw new Error('No se encontró el botón de eliminar');
          }
        } else {
          console.warn(`No se encontró el botón de eliminar para el rango con inicio=${rangeToDelete.start}`);
          throw new Error('No se encontró el botón de eliminar');
        }
      } else {
        console.warn(`No se encontró la fila para el rango con inicio=${rangeToDelete.start}`);
        throw new Error('No se encontró la fila para el rango seleccionado');
      }
      
    } catch (error) {
      console.error('Error en la prueba de eliminación de rango:', error);
      await browser.saveScreenshot('./errorShots/delete-range-test-error.png');
      throw error;
    }
  });
});
