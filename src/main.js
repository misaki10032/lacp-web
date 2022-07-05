import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import VueCookies from 'vue-cookies'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import {axios} from '@/util/baserequest'
import {axios_interview} from '@/util/baserequest'


Vue.prototype.$axios = axios
Vue.prototype.$axiositv = axios_interview
Vue.config.productionTip = false
Vue.use(VueCookies)
Vue.use(ElementUI);
Vue.use(router);

new Vue({
    render: h => h(App),
    router
}).$mount('#app')
