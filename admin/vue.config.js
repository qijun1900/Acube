const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/adminapi': {
        target: 'http://47.95.37.174:3000',
        changeOrigin: true,
      },
    },
  },  
})
