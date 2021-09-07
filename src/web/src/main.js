import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store/index.js'
import './assets/css/global.css'
import './plugins/element.js'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  store,
}).$mount('#app')
