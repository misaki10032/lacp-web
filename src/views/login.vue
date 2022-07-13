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
