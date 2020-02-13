// 生产 || 测试
const isOnline = process.env.MODE_ENV ? process.env.MODE_ENV === 'production' : process.env.NODE_ENV === 'production'
// 开发/测试启用代理(MODE_ENV === 'production' 本地开发请求生产API；MODE_ENV === 'test' 启动测试环境)
const isProxy = process.env.NODE_ENV === 'development' || process.env.MODE_ENV === 'test'
// 构建目录(生产/测试)
const buildDir = isOnline ? 'dist-prod' : 'dist-test'
// 静态资源地址
const staticUrl = isOnline ? 'https://s.noonaapps.com/ssr/' : 'http://h5-test.noonaapps.com/dist-test/dist/client/'
// 新API地址
const baseUrl = isOnline ? 'http://api.noonaapps.com/' : 'http://47.244.1.248:8270/'
// 旧API地址
const apiUrl = isOnline ? 'https://api.see-ly.com' : 'http://161.117.97.120:10123'
// H5日志投递地址
const logUrl = isOnline ? 'http://log.noonaapps.com' : 'http://log.see-ly.com' // //test-log.bbobo.com
console.log('isOnline=>', isOnline)
console.log('isProxy=>', isProxy)
console.log('staticUrl=>', staticUrl)
console.log('baseUrl=>', baseUrl)
console.log('logUrl=>', logUrl)
module.exports = {
  mode: 'universal',

  /*
  ** 开发模式/生产模式
  */
  dev: !(process.env.NODE_ENV === 'production'),

  // 环境变量
  env: {
    baseUrl,
    apiUrl,
    logUrl
  },

  /*
  ** Headers of the page
  */
  // head: {
  // title: pkg.name,
  // meta: [
  //   { charset: 'utf-8' },
  //   { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  //   { hid: 'description', name: 'description', content: pkg.description }
  // ],
  //   link: [
  //     { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  //   ]
  // },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#FA2764' },

  /*
  ** Global CSS
  */
  css: [
    // 项目中的 Sass 文件
    { src: '~/assets/scss/main.scss', lang: 'scss' } // 指定 scss 而非 sass
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios',
    '~/plugins/filters.js'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/style-resources'
    // '@nuxtjs/pwa'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: baseUrl,
    credentials: true,
    proxy: isProxy // 非生产环境启用代理
  },

  proxy: {
    '/lang': {
      changeOrigin: true,
      target: `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}/`
    },
    '/v1': {
      secure: false,
      changeOrigin: true,
      target: baseUrl
    }
  },

  /*
  ** Build configuration
  */
  styleResources: {
    scss: [
      './assets/scss/variables/colors.scss',
      './assets/scss/variables/sizes.scss'
    ]
  },

  /*
  ** 构建输出目录
  */
  buildDir,

  build: {
    publicPath: staticUrl,
    postcss: {
      plugins: {
        'postcss-px2rem': {
          remUnit: 50
        }
      },
      preset: {
        autoprefixer: {
          browsers: ['last 10 versions']
        }
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
