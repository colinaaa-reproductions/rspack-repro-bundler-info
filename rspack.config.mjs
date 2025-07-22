import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isRunningWebpack = !!process.env.WEBPACK;
const isRunningRspack = !!process.env.RSPACK;
if (!isRunningRspack && !isRunningWebpack) {
  throw new Error("Unknown bundler");
}

/**
 * @type {import('webpack').Configuration | import('@rspack/cli').Configuration}
 */
const config = {
  mode: "development",
  devtool: false,
  entry: {
    main: "./src/index",
  },
  plugins: [(compiler) => {
    compiler.hooks.compilation.tap('test', (compilation) => {
      // Comment this out to make `__rspack_unique_id__` work
      compilation.hooks.additionalTreeRuntimeRequirements.tap('test', (_, set) => { })
    })
  }],
  experiments: {
    ...(isRunningRspack ? {
      rspackFuture: {
        bundlerInfo: {
          force: true
        }
      }
    } : {})
  },
  output: {
    clean: true,
    path: isRunningWebpack
      ? path.resolve(__dirname, "webpack-dist")
      : path.resolve(__dirname, "rspack-dist"),
    filename: "[name].js",
  },
};

export default config;
