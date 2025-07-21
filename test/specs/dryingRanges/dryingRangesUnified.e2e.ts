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
  await endInput.clearValue();
  await percentInput.clearValue();
  
  // Establecer valores
  await startInput.setValue(start.toString());
  await endInput.setValue(end.toString());
  await percentInput.setValue(percent.toString());
  
  // Modo visual: Pausa para ver el formulario completado
  if (VISUAL_MODE) {
    await browser.pause(2000);
  }
  
  // Hacer clic en el botón Guardar
  const saveButton = await $('.MuiDialog-root button[type="submit"]');
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
        return errorText;
      } catch (e) {
        console.error('Error al obtener texto del error:', e);
        return 'Error al obtener texto del error';
      }
    } catch (error) {
      console.error('Error al esperar mensaje de error:', error);
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
      
      throw new Error('El diálogo no se cerró después de hacer clic en Guardar');
    }
    
    return null;
  }
}

// Primero autenticar y luego ejecutar las pruebas
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
    
    // Verificar que estamos en la página correcta
    console.log('Esperando por el título de la página...');
    // Usar un selector más general para el título
    await browser.waitUntil(
      async () => {
        const pageTitle = await $('.MuiTypography-h4, h4');
        return await pageTitle.isExisting();
      },
      {
        timeout: 15000,
        timeoutMsg: 'No se encontró el título de la página después de 15 segundos',
        interval: 1000
      }
    );
    
    // Obtener el texto del título
    const pageTitle = await $('.MuiTypography-h4, h4');
    const titleText = await pageTitle.getText();
    console.log(`Título de la página: ${titleText}`);
    expect(titleText.toLowerCase()).toContain('rango');
  });

  // TEST 1: CREAR UN RANGO QUE NO SE SOLAPE CON LOS EXISTENTES
  it('debe crear un nuevo rango que no se solape con los existentes', async () => {
    // Obtener rangos existentes
    const existingRanges = await getRangesFromTable();
    console.log(`Rangos existentes: ${JSON.stringify(existingRanges)}`);
    
    // Generar un rango que no se solape con los existentes
    const { start, end, percent } = findAvailableRange(existingRanges);
    console.log(`Rango a crear: start=${start}, end=${end}, percent=${percent}`);
    
    // Abrir el formulario para crear un nuevo rango
    const addButton = await $('button[aria-label="add"]');
    await addButton.click();
    
    // Llenar el formulario y enviarlo
    await fillFormAndSubmit(start, end, percent);
    
    // Esperar a que la tabla se actualice
    await browser.pause(2000);
    
    // Obtener los rangos actualizados para verificar
    const updatedRanges = await getRangesFromTable();
    
    // Verificar que el nuevo rango se agregó correctamente
    const rangeAdded = updatedRanges.some(
      range => 
        Math.abs(range.start - start) < 0.1 && 
        Math.abs(range.end - end) < 0.1 && 
        Math.abs(range.percent - percent) < 0.1
    );
    
    expect(rangeAdded).toBe(true);
  });

  // TEST 2: VALIDACIÓN DE SOLAPAMIENTO
  it('debe fallar al intentar crear un rango que se solapa con uno existente', async () => {
    // Obtener rangos existentes
    const existingRanges = await getRangesFromTable();
    console.log(`Rangos existentes: ${JSON.stringify(existingRanges)}`);
    
    // Si no hay rangos existentes, crear uno primero
    if (existingRanges.length === 0) {
      // Crear un rango inicial
      const initialRange = { start: 10, end: 20, percent: 5 };
      
      // Abrir el formulario para crear un nuevo rango
      const addButton = await $('button[aria-label="add"]');
      await addButton.click();
      
      // Llenar el formulario y enviarlo
      await fillFormAndSubmit(initialRange.start, initialRange.end, initialRange.percent);
      
      // Esperar a que la tabla se actualice
      await browser.pause(2000);
      
      // Actualizar la lista de rangos existentes
      const updatedRanges = await getRangesFromTable();
      console.log(`Rangos después de crear uno inicial: ${JSON.stringify(updatedRanges)}`);
      
      // Verificar que el rango se creó correctamente
      const rangeAdded = updatedRanges.some(
        range => 
          Math.abs(range.start - initialRange.start) < 0.1 && 
          Math.abs(range.end - initialRange.end) < 0.1 && 
          Math.abs(range.percent - initialRange.percent) < 0.1
      );
      
      expect(rangeAdded).toBe(true);
      
      // Abrir nuevamente para crear el rango solapado
      await addButton.click();
      
      // Intentar crear un rango que se solape
      const errorText = await fillFormAndSubmit(15, 25, 10, true);
      
      // Verificar que se muestra un mensaje de error
      expect(errorText).toBeTruthy();
      
      // Verificar que contenga texto relacionado con solapamiento
      expect(errorText?.toLowerCase()).toContain('solap') || 
      expect(errorText?.toLowerCase()).toContain('overlap') || 
      expect(errorText?.toLowerCase()).toContain('rang');
    } else {
      // Ya hay rangos existentes, usar el primero para crear solapamiento
      const existingRange = existingRanges[0];
      
      // Crear un rango que se solape con el existente
      const overlapStart = existingRange.start + (existingRange.end - existingRange.start) / 2;
      const overlapEnd = existingRange.end + 5;
      const overlapPercent = 10;
      
      // Abrir el formulario para crear un nuevo rango
      const addButton = await $('button[aria-label="add"]');
      await addButton.click();
      
      // Llenar el formulario y enviarlo, esperando error
      const errorText = await fillFormAndSubmit(overlapStart, overlapEnd, overlapPercent, true);
      
      // Verificar que se muestra un mensaje de error
      expect(errorText).toBeTruthy();
      
      // Verificar que contenga texto relacionado con solapamiento
      expect(errorText?.toLowerCase()).toContain('solap') || 
      expect(errorText?.toLowerCase()).toContain('overlap') || 
      expect(errorText?.toLowerCase()).toContain('rang');
    }
  });

  // TEST 3: VALIDACIÓN DE CAMPO START MAYOR QUE END
  it('debe fallar al intentar crear un rango con start mayor que end', async () => {
    // Abrir el formulario para crear un nuevo rango
    const addButton = await $('button[aria-label="add"]');
    await addButton.click();
    
    // Llenar el formulario con start mayor que end
    const errorText = await fillFormAndSubmit(30, 20, 5, true);
    
    // Verificar que se muestra un mensaje de error
    expect(errorText).toBeTruthy();
    
    // Verificar que el mensaje contenga información sobre el error
    expect(errorText?.toLowerCase()).toContain('mayor') || 
    expect(errorText?.toLowerCase()).toContain('menor') || 
    expect(errorText?.toLowerCase()).toContain('start') || 
    expect(errorText?.toLowerCase()).toContain('end');
  });

  // TEST 4: VALIDACIÓN DE CAMPOS VACÍOS
  it('debe fallar al intentar crear un rango con campos vacíos', async () => {
    // Abrir el formulario para crear un nuevo rango
    const addButton = await $('button[aria-label="add"]');
    await addButton.click();
    
    // Esperar a que el formulario esté completamente cargado
    await waitForFormDialog();
    
    // Hacer clic en el botón Guardar sin llenar los campos
    const saveButton = await $('.MuiDialog-root button[type="submit"]');
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
  });

  // TEST 5: VALIDACIÓN DE VALORES NEGATIVOS
  it('debe fallar al intentar crear un rango con valores negativos', async () => {
    // Abrir el formulario para crear un nuevo rango
    const addButton = await $('button[aria-label="add"]');
    await addButton.click();
    
    // Llenar el formulario con valores negativos
    const errorText = await fillFormAndSubmit(-10, -5, 5, true);
    
    // Verificar que se muestra un mensaje de error
    expect(errorText).toBeTruthy();
    
    // Verificar que el mensaje contenga información sobre el error
    expect(errorText?.toLowerCase()).toContain('negativ') || 
    expect(errorText?.toLowerCase()).toContain('mayor') || 
    expect(errorText?.toLowerCase()).toContain('cero') || 
    expect(errorText?.toLowerCase()).toContain('positive');
  });

  // TEST 6: VALIDACIÓN DE PORCENTAJE FUERA DE RANGO
  it('debe fallar al intentar crear un rango con porcentaje fuera de límites', async () => {
    // Abrir el formulario para crear un nuevo rango
    const addButton = await $('button[aria-label="add"]');
    await addButton.click();
    
    // Llenar el formulario con porcentaje negativo
    let errorText = await fillFormAndSubmit(10, 20, -5, true);
    
    // Verificar que se muestra un mensaje de error
    expect(errorText).toBeTruthy();
    
    // Verificar que el mensaje contenga información sobre el error de porcentaje
    expect(errorText?.toLowerCase()).toContain('porcent') || 
    expect(errorText?.toLowerCase()).toContain('percent') || 
    expect(errorText?.toLowerCase()).toContain('negativ');
    
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
    await addButton.click();
    
    // Llenar el formulario con porcentaje muy alto (por ejemplo, 101%)
    errorText = await fillFormAndSubmit(10, 20, 101, true);
    
    // Verificar que se muestra un mensaje de error
    expect(errorText).toBeTruthy();
    
    // Verificar que el mensaje contenga información sobre el error de porcentaje
    expect(errorText?.toLowerCase()).toContain('porcent') || 
    expect(errorText?.toLowerCase()).toContain('percent') || 
    expect(errorText?.toLowerCase()).toContain('máximo') || 
    expect(errorText?.toLowerCase()).toContain('maximum');
  });
});
