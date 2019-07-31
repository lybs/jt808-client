import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

import './plugins/elementUI'
import ipcService from './plugins/ipcService'
import localStorageCache from './plugins/localStorageCache'

import './assets/css/global.css'

import App from './App'
import router from './router'
import store from './store'

Vue.use(VueClipboard)
Vue.use(ipcService)
Vue.use(localStorageCache)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')
