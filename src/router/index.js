import Vue from 'vue';
import router from 'vue-router'; /* 导入路由 */
import dbmain from "../views/basicDatebase/main.vue";
import login from "../views/login.vue";
import mainlist from "../views/basicDatebase/InfoManagement/mainList.vue"
import console_v from "../views/basicDatebase/datebaseView/console.vue"
import db_v from "../views/basicDatebase/datebaseView/db.vue"
import table_v from "../views/basicDatebase/datebaseView/table.vue"
import atomic_v from "../views/basicDatebase/labelView/atomic.vue"
import complex_v from "../views/basicDatebase/labelView/complex.vue"
import portrait_v from "../views/basicDatebase/labelView/portrait.vue"
import basicmain from "../views/basicmain.vue"
import itv_main from "../views/interview/main"
import itvexamdef from "../views/interview/examDefManage/exam"
import botmsg_v from "../views/basicDatebase/botMsgView/botmsg.vue"
import newsheadlines_v from "../views/basicDatebase/botMsgView/newsHeadlines.vue"
import index from "../views/indexView/index.vue"

Vue.use(router)
var rout = new router({
    routes: [{
        path: '/login',
        name: 'login',
        component: login
    }, {
        path: '/welcome',
        redirect:"/index",
        name: 'basicmain',
        component: basicmain,
        children: [
            {
                path: "/index",
                component: index
            }
        ]
    }, {
        path: '/dbmain',
        name: 'dbmain',
        redirect: "/mainlist",
        component: dbmain,
        children: [{
            path: "/mainlist",
            component: mainlist
            },
            {
                path: "/console",
                component: console_v
            },
            {
                path: "/db",
                component: db_v
            },
            {
                path: "/table",
                component: table_v
            },
            {
                path: "/atomic",
                component: atomic_v
            },
            {
                path: "/complex",
                component: complex_v
            },
            {
                path: "/portrait",
                component: portrait_v
            },
            {
                path: "/botmsg",
                component: botmsg_v
            },
            {
                path: "/newsheadlines",
                component : newsheadlines_v
            }
        ]
    }, {
        path: "/",
        redirect: '/weclome'
    }, {
        path: "/itvmain",
        name: "itvmain",
        component: itv_main,
        children: [
            {
                path: "/itvexamdef",
                component: itvexamdef
            }
        ]
    }]
})

export default rout;

rout.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        return next();
    } else {
        const token = sessionStorage.getItem("token");
        console.log(token)
        if (token == null) {
            return next("/login");
        } else {
            var lastTime = token.split(";")[1].split("=");
            if (Date.parse(lastTime) < Date.parse(new Date())) {
                alert("过期token")
                return next("/login");
            }
            next();
        }
    }
})
