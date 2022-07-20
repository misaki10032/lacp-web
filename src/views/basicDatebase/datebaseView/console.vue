<template>
	<div>
		<el-breadcrumb style="margin-bottom: 20px">
			<el-breadcrumb-item :to="{ path: '/welcome' }">主站</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/mainlist' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/console' }">控制台</el-breadcrumb-item>
		</el-breadcrumb>
		<el-select v-model="exec.dbName" clearable placeholder="请选择">
			<el-option v-for="item, index in dbNames" :key="index" :value="item"></el-option>
		</el-select>
		<div>
			<!-- <el-input type="textarea" :rows="2" placeholder="编写你的SQL语句" :autosize="{ minRows:5, maxRows: 5 }"
				v-model="exec.sql">
			</el-input> -->
			<div id="monaco-editor" style="height:450px;border:2px solid #d9cfcf;">{{ editor.value }}</div>

			<el-button style="margin-top: 10px;" type="primary" plain @click="execute()">执行</el-button>
			<br>
			<div>
				<el-table :data="res" border>
					<template v-for="(item, index) in fields">
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
import * as monaco from 'monaco-editor'
export default {

	data() {
		return {
			dbNames: [],
			fields: [],
			exec: {
				sql: "",
				dbName: "test"
			},
			res: [],
			errorInfo: "",
			editor: {},
			edRes:{},
			title:'-- 请在下方输入您的sql语句 --\n' 
					+'-- 执行查询前，请保证数据源正确，如果查询不同数据库的表关联，请在表名前添加数据库名 --\n'
					+'-- 编辑器暂不支持对MySQL原始表的查询操作 --\n'
					+'-- 注释语句需要在行前和行后都添加注释符号 --\n'
					+'-- 示例：select label_name from t_lacp_atomic_label --\n'
		}
	},
	mounted() {
		this.findDBList()
		this.editor = monaco.editor.create(document.getElementById('monaco-editor'), {
			value:  '-- 请在下方输入您的sql语句 --\n' 
					+'-- 执行查询前，请保证数据源正确，如果查询不同数据库的表关联，请在表名前添加数据库名 --\n'
					+'-- 注释语句需要在行前和行后都添加注释符号 --\n'
					+'-- 示例：select label_name from t_lacp_atomic_label --\n'
					+"select\n     distinct SUBSTRING_INDEX(SUBSTRING_INDEX(t.nums, ',', ht.help_topic_id + 1), ',', -1) as num \nfrom\n     mysql.help_topic ht,\n     (\n         select\n             '1' as id,\n             GROUP_CONCAT(label_source) as nums\n         from\n             test.t_lacp_atomic_label\n         where\n             label_type = 2\n     ) t \nwhere     ht.help_topic_id < length(t.nums) - length(replace(t.nums, ',', '')) + 1",
			language: 'sql',
			automaticLayout: true
		})
	},
	methods: {
		findDBList() {
			var that = this;
			this.$axios.get("/db/list").then(function (res) {
				if (res.data.status == "ok") {
					that.dbNames = res.data.data;
				}
			})
		},
		execute() {
			this.exec.sql = this.editor.getValue()
			if (this.exec.sql == this.title) {
				this.$notify.error({
						title: '语句为空',
						message: '请输入SQL语句后重新尝试'
					});
				return
			}
			// 去掉注释
			var nowsqlFirst = this.exec.sql.replace(/--.*--/g," ")
			var nowsql = nowsqlFirst.replace(/#.*#/g," ");
			// 在换行前添加空格键
			var thissql = nowsql.replace(/\n/g," ")
			console.log(thissql)
			var that = this;
			this.exec.sql = thissql;
			this.$axios.post("/db/table/execute",this.exec,{
				headers: { 'Content-Type': 'application/json' }
			}).then(function (
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
