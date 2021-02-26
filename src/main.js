import Vue from 'vue'
import App from './App.vue'
import VueTheMask from 'vue-the-mask';
import BootstrapVue from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap-vue/dist/bootstrap-vue.css'
import PageTitle from './components/PageTitle/PageTitle.vue'
Vue.config.productionTip = false

Vue.use(BootstrapVue)
  .use(VueTheMask)


library.add(fas)
Vue.component('fas', FontAwesomeIcon)
Vue.component('PageTitle', PageTitle)
new Vue({
  render: h => h(App),
}).$mount('#app')
