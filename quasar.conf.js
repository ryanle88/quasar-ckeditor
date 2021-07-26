/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli/quasar-conf-js

/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint func-names: 0 */
/* eslint global-require: 0 */
const { configure } = require('quasar/wrappers');
const path = require('path');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');

module.exports = configure(ctx => ({
  // https://v2.quasar.dev/quasar-cli/supporting-ts
  supportTS: {
    tsCheckerConfig: {
      eslint: {
        enabled: true,
        files: './src/**/*.{ts,tsx,js,jsx,vue}'
      }
    }
  },

  // https://v2.quasar.dev/quasar-cli/prefetch-feature
  // preFetch: true,

  // app boot file (/src/boot)
  // --> boot files are part of "main.js"
  // https://v2.quasar.dev/quasar-cli/boot-files
  boot: [
    'axios',
    'ckeditor5'
  ],

  // https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
  css: [
    'app.scss'
  ],

  transpileDependencies: [/ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/],

  configureWebpack: {
    plugins: [
        // CKEditor needs its own plugin to be built using webpack.
        new CKEditorWebpackPlugin({
            // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
            language: 'en',

            // Append translations to the file matching the `app` name.
            translationsOutputFile: /app/
        })
    ]
},

  // https://github.com/quasarframework/quasar/tree/dev/extras
  extras: [
    // 'ionicons-v4',
    // 'mdi-v5',
    // 'fontawesome-v5',
    // 'eva-icons',
    // 'themify',
    // 'line-awesome',
    // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

    'roboto-font', // optional, you are not bound to it
    'material-icons' // optional, you are not bound to it
  ],

  // Full list of options: https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
  build: {
    vueRouterMode: 'hash', // available values: 'hash', 'history'

    // transpile: false,

    // Add dependencies for transpiling with Babel (Array of string/regex)
    // (from node_modules, which are by default not transpiled).
    // Applies only if "transpile" is set to true.
    // transpileDependencies: [],

    // rtl: true, // https://v2.quasar.dev/options/rtl-support
    // preloadChunks: true,
    // showProgress: false,
    // gzip: true,
    // analyze: true,

    // Options below are automatically set depending on the env, set them if you want to override
    // extractCSS: false,

    // https://v2.quasar.dev/quasar-cli/handling-webpack
    // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
    chainWebpack(chain) {
        // (1.) To handle editor icons, get the default rule for *.svg files first:
        const svgRule = chain.module.rule('svg');

        // Then you can either:
        //
        // * clear all loaders for existing 'svg' rule:
        //
        // svgRule.uses.clear();
        //
        // * or exclude ckeditor directory from node_modules:
        svgRule.exclude.add(
            path.join(__dirname, 'node_modules', '@ckeditor')
        );

        // Add an entry for *.svg files belonging to CKEditor. You can either:
        //
        // * modify the existing 'svg' rule:
        //
        // svgRule.use( 'raw-loader' ).loader( 'raw-loader' );
        //
        // * or add a new one:
        chain.module
            .rule('cke-svg')
            .test(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/)
            .use('raw-loader')
            .loader('raw-loader');

        // (2.) Transpile the .css files imported by the editor using PostCSS.
        // Make sure only the CSS belonging to ckeditor5-* packages is processed this way.
        chain.module
            .rule('cke-css')
            .test(/ckeditor5-[^/\\]+[/\\].+\.css$/)
            .use('postcss-loader')
            .loader('postcss-loader')
            .tap(() => {
                return styles.getPostCssConfig({
                    themeImporter: {
                        themePath: require.resolve(
                            '@ckeditor/ckeditor5-theme-lark'
                        )
                    },
                    minify: true
                });
            });
    }
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
  devServer: {
    https: false,
    port: 8080,
    open: true // opens browser window automatically
  },

  // https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
  framework: {
    config: {},

    // iconSet: 'material-icons', // Quasar icon set
    // lang: 'en-US', // Quasar language pack

    // For special cases outside of where the auto-import strategy can have an impact
    // (like functional components as one of the examples),
    // you can manually specify Quasar components/directives to be available everywhere:
    //
    // components: [],
    // directives: [],

    // Quasar plugins
    plugins: []
  },

  // animations: 'all', // --- includes all animations
  // https://v2.quasar.dev/options/animations
  animations: [],

  // https://v2.quasar.dev/quasar-cli/developing-ssr/configuring-ssr
  ssr: {
    pwa: false,

    // manualStoreHydration: true,
    // manualPostHydrationTrigger: true,

    prodPort: 3000, // The default port that the production server should use
    // (gets superseded if process.env.PORT is specified at runtime)

    maxAge: 1000 * 60 * 60 * 24 * 30,
    // Tell browser when a file from the server should expire from cache (in ms)

    chainWebpackWebserver(/* chain */) {
      //
    },

    middlewares: [
      ctx.prod ? 'compression' : '',
      'render' // keep this as last one
    ]
  },

  // https://v2.quasar.dev/quasar-cli/developing-pwa/configuring-pwa
  pwa: {
    workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
    workboxOptions: {}, // only for GenerateSW

    // for the custom service worker ONLY (/src-pwa/custom-service-worker.[js|ts])
    // if using workbox in InjectManifest mode
    chainWebpackCustomSW(/* chain */) {
      //
    },

    manifest: {
      name: 'Quasar App',
      short_name: 'Quasar App',
      description: 'A Quasar Framework app',
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#ffffff',
      theme_color: '#027be3',
      icons: [
        {
          src: 'icons/icon-128x128.png',
          sizes: '128x128',
          type: 'image/png'
        },
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icons/icon-256x256.png',
          sizes: '256x256',
          type: 'image/png'
        },
        {
          src: 'icons/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
  cordova: {
    // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
  capacitor: {
    hideSplashscreen: true
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
  electron: {
    bundler: 'packager', // 'packager' or 'builder'

    packager: {
      // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

      // OS X / Mac App Store
      // appBundleId: '',
      // appCategoryType: '',
      // osxSign: '',
      // protocol: 'myapp://path',

      // Windows only
      // win32metadata: { ... }
    },

    builder: {
      // https://www.electron.build/configuration/configuration

      appId: 'quasar'
    },

    // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
    chainWebpack(/* chain */) {
      // do something with the Electron main process Webpack cfg
      // extendWebpackMain also available besides this chainWebpackMain
    },

    // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
    chainWebpackPreload(/* chain */) {
      // do something with the Electron main process Webpack cfg
      // extendWebpackPreload also available besides this chainWebpackPreload
    }
  }
}));
