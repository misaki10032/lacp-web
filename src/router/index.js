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

Vue.use(router)
var rout = new router({
	routes: [{
		path: '/login',
		name: 'login',
		component: login
	}, {
		path: '/welcome',
		name: 'basicmain',
		component: basicmain,
		children: []
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
			}
		]
	}, {
		path: "/",
		redirect: '/weclome'
	}]
})

export default rout;

rout.beforeEach((to, from, next) => {
	if (to.path == '/login') {
		return next();
	} else {
		const uid = sessionStorage.getItem("sso_uid");
		console.log(uid)
		if (uid == null) {
			return next("/login");
		} else {
			next();
		}
	}
})
