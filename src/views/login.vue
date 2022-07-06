<template>
	<div class="login_container">
		<!-- 登录盒子-->
		<div class="login_box">
			<!-- 头像盒子-->
			<div class="img_box">
				<img src="../assets/snut.png" />
			</div>
			<!-- 表单区域表单数据绑定-->
			<el-form :model="loginForm" class="login_form">
				<el-form-item>
					<el-input v-model="loginForm.num" placeholder="请输入账号" prefix-icon="iconfont icon-yonghu">
					</el-input>
				</el-form-item>

				<el-form-item>
					<el-input v-model="loginForm.pwd" placeholder="请输入密码" prefix-icon="iconfont icon-mima"
						type="password">
					</el-input>
				</el-form-item>

				<el-form-item class="btn_box">
					<el-button type="primary" @click="login">登录</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>

</template>

<script>
	export default {
		data() {
			return {
				loginForm: {
					num: "",
					pwd: ""
				}
			}
		},
		mounted() {
			// 请求sso接口
		},
		methods: {
			//登录
			login() {

				var myDate = new Date(new Date().getTime() + 6 * 60 * 60 * 1000);
				var adminId = this.loginForm.num;
				var lastTime = myDate.toLocaleString();
				var tokenVal = "sso_uid="+adminId+";lastTime="+lastTime
				window.sessionStorage.setItem("token", tokenVal);
				this.$router.push("/welcome");
			}
		}
	}
</script>

<style>
	html,
	body,
	#app,
	.login_container {
		height: 100%;
		margin: 0px;
		padding: 0px;
	}

	.login_container {
		background-color: #00a7fa;
		background: linear-gradient(145deg, #8b0389, #7f51ce, #00a7fa, #7f51ce, #8b0389);
	}

	.login_box {
		width: 450px;
		height: 300px;
		background-color: #fff;
		border-radius: 10px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.img_box {
		width: 130px;
		height: 130px;
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		border-radius: 50%;
		padding: 5px;
		border: 1px solid #eee;
	}

	.img_box img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: #eee;
	}

	.btn_box {
		text-align: right;
		padding-right: 20px;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.link_box {
		margin: 0;
		padding: 0;
		text-align: right;
		padding-right: 20px;
	}

	.login_form {
		position: absolute;
		bottom: 20px;
		width: 100%;
		padding: 0px 20px;
		box-sizing: border-box;
	}

	.codeGeting {
		background: #cdcdcd;
		border-color: #cdcdcd;
	}
</style>
