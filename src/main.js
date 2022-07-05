import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import VueCookies from 'vue-cookies'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'


Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(VueCookies)
Vue.use(ElementUI);
Vue.use(router);

// axios.defaults.baseURL = "http://124.222.34.234:27314/api";
axios.defaults.baseURL = "http://124.222.34.234:27400/api/lacp";

axios.interceptors.request.use(config => {
    config.headers.token = window.sessionStorage.getItem('sso_uid');
    return config;
})

axios.interceptors.response.use((res) => {
    if (res.data.message == 'session失效') {
        router.replace("/login");
    }
    return res;
});

new Vue({
    render: h => h(App),
    router
}).$mount('#app')
