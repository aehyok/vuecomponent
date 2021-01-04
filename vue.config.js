const path = require('path')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

module.exports = {
  lintOnSave: 'error',
  publicPath: './',
  outputDir: '../../release/ui/console',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      // global scss variables 传递配置选项到 sass-loader
      scss: {
        prependData: `@import "~@/styles/_variable.scss";`,
      },
    },
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      const plugins = []
      // plugins.push(
      //   new UglifyJsPlugin({
      //     uglifyOptions: {
      //       compress: {
      //         drop_console: true,
      //         drop_debugger: false,
      //         pure_funcs: ['console.log'], // 移除console
      //       },
      //     },
      //     sourceMap: false,
      //     parallel: true,
      //   }),
      // )
      config.plugins = [...config.plugins, ...plugins]
    } else {
      config.devtool = 'source-map'
    }
  },
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 打包分析
    if (process.env.IS_ANALYZ) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static',
        },
      ])
    }

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()
  },
  devServer: {
    port: 9927,
    proxy: {
      '/infra': {
        target: 'http://172.18.5.33:3000',
        // target: 'http://dvs-dev.sunlight-tech.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/infra': '',
        },
      },
    },
  },
}
