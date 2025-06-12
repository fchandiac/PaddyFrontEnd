exports.config = {
  runner: 'local',
  specs: [
    './test/specs/**/*.ts'
  ],
  exclude: [],
  maxInstances: 10,
  capabilities: [{
    maxInstances: 1,
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: [
        // '--headless=new',  // Comentado para ver la ejecución de los tests
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1280,720',
        '--disable-infobars',
        '--disable-extensions',
        '--disable-web-security',  // Para evitar problemas con CORS
        '--ignore-certificate-errors'
      ],
      // Utilizar el navegador Chromium específico del proyecto si existe
      binary: process.env.CHROMIUM_PATH || undefined
    },
    acceptInsecureCerts: true
  }],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost:3000',
  waitforTimeout: 20000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 5,
  services: ['chromedriver'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: './test/tsconfig.json',
      transpileOnly: true
    }
  },
  onPrepare: function (config, capabilities) {
    console.log('Asegúrate de que tu aplicación Next.js esté corriendo en localhost:3000');
  },
  onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // Inicialización específica para cada worker
  },
  beforeTest: async function (test, context) {
    console.log(`Ejecutando test: ${test.title}`);
  },
  afterTest: async function(test, context, { error, result, duration, passed, retries }) {
    if (error) {
      console.log(`Test fallido: ${test.title}`);
      console.log(`Error: ${error.message}`);
      
      // Tomar una captura de pantalla cuando falla un test
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const screenshotPath = `./errorShots/error-${test.title.replace(/\s+/g, '-')}-${timestamp}.png`;
      await browser.saveScreenshot(screenshotPath);
      console.log(`Captura de pantalla guardada en: ${screenshotPath}`);
      
      // Obtener y registrar la URL actual
      const url = await browser.getUrl();
      console.log(`URL en el momento del fallo: ${url}`);
      
      // Registrar HTML de la página para depuración
      const html = await browser.execute(() => document.documentElement.outerHTML);
      console.log(`HTML actual: ${html.substring(0, 500)}...`);
    }
  },
}
