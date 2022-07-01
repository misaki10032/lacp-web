<template>
	<div>
		<el-breadcrumb style="margin-bottom: 20px">
			<el-breadcrumb-item :to="{ path: '/welcome' }">主站</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/mainlist' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/console' }">控制台</el-breadcrumb-item>
		</el-breadcrumb>
		<el-select v-model="exec.dbName" clearable placeholder="请选择">
			<el-option v-for="item,index in dbNames" :key="index" :value="item"></el-option>
		</el-select>
		<div>
			<el-input type="textarea" :rows="2" placeholder="编写你的SQL语句" :autosize="{ minRows:5, maxRows: 5 }"
				v-model="exec.sql">
			</el-input>
			
			<el-button style="margin-top: 10px;" type="primary" plain @click="execute()">执行</el-button>
			<br>
			<div>
				<el-table :data="res">
					<template v-for="(item,index) in fields">
						<el-table-column :prop="item.column_name" :label="item.column_comment" :key="index"
							v-if="item.column_name != 'id'"></el-table-column>
					</template>
				</el-table>
				<p> {{ errorInfo }}</p>
			</div>
		</div>

	</div>

</template>

<script>
	export default {

		data() {
			return {
				dbNames: [],
				fields: [],
				exec: {
					sql: "select * from t_lacp_atomic_label",
					dbName: "test"
				},
				res: [],
				errorInfo: ""
			}
		},
		mounted() {
			this.findDBList()
		},
		methods: {
			findDBList() {
				var that = this;
				this.$axios.get("/db/list").then(function(res) {
					if (res.data.status == "ok") {
						that.dbNames = res.data.data;
					}
				})
			},
			execute() {
				var that = this;
				this.$axios.post("/db/table/execute?sql=" + this.exec.sql + "&dbName=" + this.exec.dbName).then(function(
					res) {
					if (res.data.status == "ok") {
						that.errorInfo = "";
						that.res = res.data.data;
						that.$notify({
							title: '查询成功',
							message: "success",
							type: 'success'
						});
						that.fields = [];
						var arr = Object.keys(that.res[0]);
						console.log(arr)
						for (var i in arr) {
							var fieldObj = {
								column_name: arr[i],
								column_comment: arr[i]
							}
							that.fields.push(fieldObj);
						}
					} else {
						that.$notify.error({
							title: '查询失败',
							message: res.data
						});
						that.res = []
						that.errorInfo = res.data
					}
				})
			},

		}
	}
</script>
