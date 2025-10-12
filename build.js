import esbuild from 'esbuild';
import {sassPlugin} from 'esbuild-sass-plugin';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import "dotenv/config";

const port = 8000;
const args = process.argv.slice(2);
const watch = args.includes("--watch");
const dev = args.includes("--dev");

const watchPlugin = {
  name: 'watch-plugin',
  setup(build) {
    build.onStart(() => {
      console.log(`Build starting: ${new Date(Date.now()).toLocaleString()}`);
    });

    build.onEnd((result) => {
      if(result.errors && result.errors.length > 0) {
        console.log(`Build finished, with errors ${new Date(Date.now()).toLocaleString()}`);
        console.log(errors);
      } else {
        console.log(`Build finished successfully: ${new Date(Date.now()).toLocaleString()}`)
      }
    });
  }
}

let commonSettings = {
  logLevel: 'debug',
  metafile: true,
  entryPoints: [
    'src/styles/index.scss',
    'src/index.js'
  ],
  outdir: 'public/assets',
  bundle: true,
  loader: { 
    '.js': 'jsx',
    ".png": "dataurl",
    ".woff": "dataurl",
    ".woff2": "dataurl",
    ".eot": "dataurl",
    ".ttf": "dataurl",
    ".svg": "dataurl",
  },
  plugins: [
    sassPlugin({
      async transform(source) {
        const { css } = await postcss([autoprefixer]).process(
          source
        );
        return css;
      },
    }),
    watchPlugin
  ],
  define: {
    'API_BASE_URL': JSON.stringify(process.env.API_BASE_URL),
    'TOKEN_BEARER': JSON.stringify(process.env.TOKEN_BEARER),
    'CURRENT_USER': JSON.stringify(process.env.CURRENT_USER)
  }
}

let debugSettings = {}
let productionSettings = {}

if(watch ||  dev) {
  // override settings here for debugSettings
  debugSettings = {
    ...commonSettings,
    logLevel: "debug",
    sourcemap: "linked"
  }

  let debugMode = await esbuild.context(debugSettings)
  console.log("Watching for changes...");

  // watch and dev
  if (watch) {
    console.log("Watching for changes...");
    debugMode.watch();
  }

  if(dev) {
    console.log("Debug Mode with" , debugSettings);
    debugMode.serve({
      servedir: 'public',
      port: port
    });
  }
} else {
  productionSettings = {
    ...commonSettings,
    // add settings for production.
  }
  console.log("Building with" , productionSettings);
  esbuild.build(productionSettings).catch((err) => {
    console.error(err);
    process.exit(1);
  });
  console.log("Deployment build completed.");
}
