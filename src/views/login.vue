<template>
	<div class="login_container">
		<!-- 登录盒子-->
		<div class="login_box">
			<!-- 头像盒子-->
			<div class="img_box">
				<img src="data:image/jpeg;base64,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" />
			</div>
			<!-- 表单区域表单数据绑定-->
			<el-form :model="loginForm" class="login_form">
				<el-form-item>
					<el-input v-model="loginForm.email" placeholder="请输入邮箱" prefix-icon="iconfont icon-yonghu">
					</el-input>
				</el-form-item>

				<el-form-item>
					<el-input v-model="loginForm.password" placeholder="请输入密码" prefix-icon="iconfont icon-mima"
						type="password">
					</el-input>
				</el-form-item>

				<el-form-item class="btn_box">
					<el-button type="primary" @click="login">登录</el-button>
					<el-button type="warning" @click="dialogFormVisible = true">注册</el-button>
				</el-form-item>
			</el-form>
		</div>
		<el-dialog title="注册信息" :visible.sync="dialogFormVisible" width="30rem">
				<el-input v-model="reUser.uemail" placeholder="邮箱" clearable></el-input>
				<el-input v-model="reUser.uphone" placeholder="手机号" clearable></el-input>
				<el-input v-model="reUser.upassword" placeholder="密码" clearable></el-input>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="addUser()">确 定</el-button>
				</div>
		</el-dialog>
	</div>

</template>

<script>
	export default {
		data() {
			return {
				loginForm: {
					email: "",
					password: ""
				},
				loginUser : {
					"createTime": "",
					"email": "",
					"id": "",
					"mobile": "",
					"password": "",
					"ssoId": "",
					"userRole": "",
					"updateTime": ""
				},
				reUser: {
					uemail:"",
					uphone:"",
					upassword:""
				},
				dialogFormVisible: false,
			}
		},
		mounted() {
			// 请求sso接口
		},
		methods: {
			//登录
			login() {
				var that = this;
				this.$axiosSso.post("/user/login?email="+that.loginForm.email+"&password="+that.loginForm.password).then(function (res) {
					if (res.data.status == "ok") {
						that.loginUser = res.data.data;
						var myDate = new Date(new Date().getTime() + 6 * 60 * 60 * 1000);
						var ssoId = that.loginUser.ssoId;
						var lastTime = myDate.toLocaleString();
						var tokenVal = "sso_uid="+ssoId+";lastTime="+lastTime
						window.sessionStorage.setItem("token", tokenVal);
						window.sessionStorage.setItem("userRole", that.loginUser.userRole);
						that.$router.push("/welcome");
					} else {
						that.$notify.error({
							title: '账号或密码错误',
							message: res.data.message
						});
					}
				})
			},
			addUser(){
				var that = this;
				this.$axiosSso.post("/user/regist?email="+that.reUser.uemail+"&password="+that.reUser.upassword+"&mobile="+that.reUser.uphone).then(function (res) {
					if (res.data.status == "ok") {
						that.$notify({
							title: '注册成功',
							message: "邮箱-" + that.reUser.uemail,
							type: 'success'
						});
						that.reUser.uemail = "";
						that.reUser.upassword = "";
						that.reUser.uphone = "";
						that.dialogFormVisible = false;
					} else {
						that.$notify.error({
							title: res.data.status,
							message: res.data.message
						});
					}
				})
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
