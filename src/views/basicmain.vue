<template>
	<div class="hello" style="background-color: #ffffff;height: 100%;">
		<el-menu router :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
			background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
			<el-menu-item index="/welcome">首页</el-menu-item>
			<el-menu-item index="/index">主站</el-menu-item>
			<el-submenu index="/welcome">
				<template slot="title">面试题</template>
				<el-menu-item index="/itvmain">面试管理</el-menu-item>
			</el-submenu>
			<el-menu-item index="/welcome">分享平台</el-menu-item>
			<el-menu-item v-if="userRole == 1" index="/dbmain">数据管理</el-menu-item>
			<el-menu-item v-if="userRole == 1" @click="toScheduing()">任务调度</el-menu-item>
			<el-tooltip class="item" content="退出登录" effect="dark" placement="bottom">
				<el-menu-item @click="logOut">退出</el-menu-item>
			</el-tooltip>
		</el-menu>
		<el-container>
			<el-main style="height: 890px;margin: 0 100px;padding: 0;border: 0;">
				<router-view></router-view>
			</el-main>
		</el-container>
	</div>
</template>
<script>
export default {
	data() {
		return {
			activeIndex: '1',
			activeIndex2: '1',
			userRole: sessionStorage.getItem("userRole")
		};
	},
	methods: {
		handleSelect(key, keyPath) {
			console.log(key, keyPath);
		},
		logOut() {
			sessionStorage.clear();
			this.$router.push("/login");
		},
		toScheduing() {
			window.open("http://124.222.34.234:27316/xxl-job-admin/")
		}
	}
}
</script>

<style>
</style>
