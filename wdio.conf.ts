/// <reference types="@wdio/globals/types" />

import type { Options } from '@wdio/types';
import path from 'path';

export const config: WebdriverIO.Config = {
  runner: 'local',

  specs: ['./test/specs/**/*.ts'],

  exclude: [],

  maxInstances: 10,

  capabilities: [
    {
      maxInstances: 1,
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          '--headless=new',
          '--disable-gpu',
          '--window-size=1280,720',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-infobars',
          '--disable-extensions'
        ]
      },
      acceptInsecureCerts: true,
    },
  ],

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
    timeout: 60000,
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
  onPrepare: function (config, capabilities) {
    // Asegúrate de que la aplicación esté en ejecución
    console.log('Asegúrate de que tu aplicación Next.js esté corriendo en localhost:3000');
  },

  /**
   * Gets executed before a worker process is spawned and can be used to initialize specific service
   * for that worker as well as modify runtime environments in an async fashion.
   */
  onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // Inicialización específica para cada worker
  },
};
