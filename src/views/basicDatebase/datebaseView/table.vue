<template>
	<div>
		<el-breadcrumb style="margin-bottom: 20px">
			<el-breadcrumb-item :to="{ path: '/welcome' }">主站</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/mainlist' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/table' }">表管理</el-breadcrumb-item>
		</el-breadcrumb>
		<el-form :inline="true" :model="form" class="demo-form-inline">
			<el-form-item label="数据库">
				<el-select v-model="form.dbName" clearable placeholder="请选择" @change="findTableList(form.dbName)">
					<el-option v-for="item in dbNames" :key="item" :value="item"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="数据表">
				<el-select v-model="form.tableName" clearable placeholder="请选择"
					@change="descTable(form.dbName,form.tableName)">
					<el-option v-for="item in tableNames" :key="item" :value="item"></el-option>
				</el-select>
			</el-form-item>
			<el-button type="warning" @click="edit()">修改表结构</el-button>
			<el-button type="success" :disabled="this.btnStatus" @click="add()">新增行</el-button>
			<el-button type="primary" :disabled="this.btnStatus" @click="saveTable()">保存</el-button>
		</el-form>
		<div>
			<el-table :data="descTableData" style="width: 100%;">
				<el-table-column label="字段名" width="200">
					<template slot-scope="scope">
						<el-input v-model="scope.row.columnName" placeholder="null"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="字段类型" width="200">
					<template slot-scope="scope">
						<el-input v-model="scope.row.dataType" placeholder="null"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="默认值" width="200">
					<template slot-scope="scope">
						<el-input v-model="scope.row.columnDefault" placeholder="null"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="是否非空" sortable width="100">
					<template slot-scope="scope">
						<el-input v-model="scope.row.isNullable" placeholder="null"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="备注" width="200">
					<template slot-scope="scope">
						<el-input v-model="scope.row.colComment" placeholder="null"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template slot-scope="scope">
						<el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row.columnName)">
							删除行
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

	</div>

</template>

<script>
	export default {

		data() {
			return {
				dbNames: [],
				tableNames: [],
				form: {
					dbName: "",
					tableName: ""
				},
				descTableData: [],
				tableInfo: {
					"colTypeList": [],
					"defaultValueList": [],
					"colNameList": [],
					"commentList": [],
					"tableName": "",
					"dbName": "",
					"isNullList": []
				},
				btnStatus: true,
				field: {
					"columnName": "",
					"dataType": "",
					"columnDefault": "",
					"isNullable": "",
					"colComment": ""
				},
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
			findTableList(value) {
				var that = this;
				this.$axios.get("/db/" + value + "/list").then(function(res) {
					if (res.data.status == "ok") {
						that.tableNames = res.data.data;
					}
				})
			},
			descTable(db, tb) {
				var that = this;
				this.$axios.get("/db/desc/" + db + "/" + tb).then(function(res) {
					if (res.data.status == "ok") {
						that.descTableData = res.data.data;
						that.toTableInfo(res.data.data);
					}
				})
				this.tableInfo.dbName = db;
				this.tableInfo.tableName = tb;
			},
			edit() {
				if (this.btnStatus) {
					this.btnStatus = false;
				} else {
					this.btnStatus = true;
				}
			},
			saveTable() {
				this.toTableInfo(this.descTableData)
				var that = this;
				this.$axios.put("/db/table/add", this.tableInfo).then(function(res) {
					console.log(res.data)
					if (res.data.status == "ok") {
						that.$notify({
							title: '保存成功',
							message: "修改-" + that.tableInfo.tableName,
							type: 'success'
						});
						that.btnStatus = true;
					} else {
						that.$notify.error({
							title: '保存失败',
							message: res.data.message
						});
						that.btnStatus = true;
					}
				})

			},
			toTableInfo(value) {
				this.tableInfo.colNameList = []
				this.tableInfo.colTypeList = []
				this.tableInfo.defaultValueList = []
				this.tableInfo.isNullList = []
				this.tableInfo.commentList = []
				for (var t = 0; t < value.length; t++) {
					var obj = this.descTableData[t];
					if (obj.columnName == 'id' || obj.columnName == 'create_time' || obj.columnName == 'update_time') {
						continue;
					}
					this.tableInfo.colNameList.push(obj.columnName);
					this.tableInfo.colTypeList.push(obj.dataType);
					this.tableInfo.defaultValueList.push(obj.columnDefault == null ? '' : obj.columnDefault);
					this.tableInfo.isNullList.push(obj.isNullable == 'NO' ? 'NOT NULL' : 'NULL');
					this.tableInfo.commentList.push(obj.colComment == null ? '' : obj.colComment);
				}
			},
			handleDelete(index, row) {
				if (this.btnStatus) {
					this.$message.error("点击修改后才可删除");
				} else {
					if (row == 'id' || row == 'create_time' || row == 'update_time') {
						this.$message.error("该Field不可删除");
					} else {
						this.descTableData.splice(index, 1);
					}
				}
			},
			add() {
				var length = this.descTableData.length;
				var newField = JSON.parse(JSON.stringify(this.field));
				this.descTableData.splice(length-2, 0, newField);
			},
		}
	}
</script>
