#!/usr/bin/env node

/**
 * Script ejecutable para crear plantillas de ejemplo
 * Uso: npm run create-templates
 */

const { createSampleTemplates, printTemplatesSummary } = require('./create-sample-templates.ts');

async function main() {
  try {
    console.log('🌟 Generador de Plantillas de Ejemplo - Paddy Frontend');
    console.log('=' .repeat(60));
    
    await createSampleTemplates();
    
    console.log('\n🎉 Proceso completado!');
  } catch (error) {
    console.error('💥 Error ejecutando el script:', error);
    process.exit(1);
  }
}

main();
