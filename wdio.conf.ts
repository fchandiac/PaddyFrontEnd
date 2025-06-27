/// <reference types="@wdio/globals/types" />

import path from 'path';

export const config = {
  runner: 'local',

  specs: ['./test/specs/**/*.ts'],

  exclude: [],

  maxInstances: 10,

  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: [
          // '--headless=new', // Comentado para ver Chrome en ejecución
          '--window-size=1280,720',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-infobars',
          '--disable-extensions',
          '--start-maximized' // Maximizar ventana para mejor visualización
        ]
      },
      acceptInsecureCerts: true,
    },
  ],

  logLevel: 'info',

  bail: 0,

  baseUrl: 'http://localhost:3000',

  // Aumentar el tiempo de espera para elementos lentos
  waitforTimeout: 30000,

  connectionRetryTimeout: 180000,

  connectionRetryCount: 5,

  services: ['chromedriver'],

  framework: 'mocha',

  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 120000, // Aumentar el timeout para pruebas más lentas
  },

  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: './test/tsconfig.json',
      transpileOnly: true
    }
  },

  /**
   * Gets executed once before all workers get launched.
   */
  onPrepare: function (config: any, capabilities: any) {
    // Asegúrate de que la aplicación esté en ejecución
    console.log('Asegúrate de que tu aplicación Next.js esté corriendo en localhost:3000');
  },

  /**
   * Gets executed before a worker process is spawned and can be used to initialize specific service
   * for that worker as well as modify runtime environments in an async fashion.
   */
  onWorkerStart: function (cid: any, caps: any, specs: any, args: any, execArgv: any) {
    // Inicialización específica para cada worker
  },
};
