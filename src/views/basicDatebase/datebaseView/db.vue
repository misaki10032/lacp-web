<template>
	<div>
		<el-breadcrumb style="margin-bottom: 20px">
			<el-breadcrumb-item :to="{ path: '/welcome' }">主站</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/mainlist' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/db' }">数据库管理</el-breadcrumb-item>
		</el-breadcrumb>
		<el-form :inline="true" :model="form" class="demo-form-inline">
			<el-form-item label="数据库">
				<el-select v-model="form.dbName" clearable placeholder="请选择" @change="findTableList(form.dbName)">
					<el-option v-for="item in dbNames" :key="item" :value="item"></el-option>
				</el-select>
			</el-form-item>
			<el-button type="warning" @click="dialogTableVisible = true">新增表</el-button>
			<el-button type="primary" @click="dialogFormVisible = true">新增库</el-button>
		</el-form>
		<div>
			<el-table :data="tableNames" style="width: 100%;">
				<el-table-column label="序号" width="100">
					<template slot-scope="scope">
						<span>{{ scope.$index+1 }}</span>
					</template>
				</el-table-column>
				<el-table-column label="表名" width="200">
					<template slot-scope="scope">
						<span>{{ scope.row }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="500">
					<template slot-scope="scope">
						<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
						</el-button>
						<el-button size="mini" type="success" @click="addPermission(scope.$index, scope.row)">授权
						</el-button>
						<el-button size="mini" type="warning" @click="delPermission(scope.$index, scope.row)">取消授权
						</el-button>
						<el-button size="mini" type="primary" @click="addToES(scope.$index, scope.row)">添加ES监控
						</el-button>
						<el-button size="mini" type="danger" @click="flushAllToES(scope.$index, scope.row)">刷新全量数据到ES
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-dialog title="数据表字段设置" :visible.sync="dialogTableVisible" width="60rem">
			<p><b>数据库名：</b><br>
				<el-select v-model="tableInfo.dbName" clearable placeholder="请选择">
					<el-option v-for="item in dbNames" :key="item" :value="item"></el-option>
				</el-select>
			</p>
			<p><b>数据表名称：</b>
				<el-input v-model="tableInfo.tableName" placeholder="请输入表名"></el-input>
			</p>
			<el-table :data="newTableInfo">
				<el-table-column label="字段名" width="200">
					<template slot-scope="scope">
						<el-input v-model="scope.row.columnName" placeholder="null" clearable></el-input>
					</template>
				</el-table-column>
				<el-table-column label="字段类型" width="150">
					<template slot-scope="scope">
						<el-input v-model="scope.row.dataType" placeholder="null" clearable></el-input>
					</template>
				</el-table-column>
				<el-table-column label="默认值" width="150">
					<template slot-scope="scope">
						<el-input v-model="scope.row.columnDefault" placeholder="null" clearable></el-input>
					</template>
				</el-table-column>
				<el-table-column label="是否非空" sortable width="200">
					<template slot-scope="scope">
						<el-input v-model="scope.row.isNullable" placeholder="null" clearable></el-input>
					</template>
				</el-table-column>
				<el-table-column label="备注" width="200">
					<template slot-scope="scope">
						<el-input v-model="scope.row.colComment" placeholder="null" clearable></el-input>
					</template>
				</el-table-column>
			</el-table>
			<i class="el-icon-circle-plus-outline" @click="add()"></i>
			<i class="el-icon-remove-outline" @click="remove()"></i>
			<el-button style="margin-left: 366px;margin-top: 10px;" type="primary" plain @click="save()">新增</el-button>
		</el-dialog>

		<el-dialog title="数据库名" :visible.sync="dialogFormVisible">
			<el-input v-model="newDbName" clearable></el-input>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addDB()">确 定</el-button>
			</div>
		</el-dialog>

	</div>

</template>

<script>
	export default {
		data() {
			return {
				dbNames: [],
				tableNames: [],
				newTableInfo: [{
					"columnName": "",
					"dataType": "",
					"columnDefault": "",
					"isNullable": "",
					"colComment": ""
				}],
				form: {
					dbName: "",
					tableName: ""
				},
				tableInfo: {
					"colTypeList": [],
					"defaultValueList": [],
					"colNameList": [],
					"commentList": [],
					"tableName": "",
					"dbName": "",
					"isNullList": []
				},
				dialogTableVisible: false,
				dialogFormVisible: false,
				field: {
					"columnName": "",
					"dataType": "",
					"columnDefault": "",
					"isNullable": "",
					"colComment": ""
				},
				newDbName: "",
				addPermissionInfo: {
					"toUser": "",
					"tables": []
				}
			}
		},
		mounted() {
			this.findDBList();
		},
		methods: {
			addDB() {
				var that = this;
				this.$axios.get("/db/add?dbName=" + this.newDbName).then(function(res) {
					if (res.data.status == "ok") {
						that.$notify({
							title: '新增成功',
							message: "新增数据库-" + that.newDbName,
							type: 'success'
						});
						that.dialogFormVisible = false;
						that.findDBList();
					} else {
						that.$notify.error({
							title: '新增失败',
							message: res.data.message
						});
					}
				})
			},
			save() {
				this.toTableInfo(this.newTableInfo)
				var nameRes = /t_\w*/;
				if (!nameRes.test(this.tableInfo.tableName)) {
					this.$message.warning("表名不满足规范：t_xxxx_aaaa")
					return;
				}
				console.log(this.tableInfo)
				var that = this;
				this.$axios.put("/db/table/add", this.tableInfo).then(function(res) {
					if (res.data.status == "ok") {
						that.$notify({
							title: '新增成功',
							message: "新增表-" + that.tableInfo.tableName,
							type: 'success'
						});
						that.dialogTableVisible = false;
					} else {
						that.$notify.error({
							title: '新增失败',
							message: res.data.message
						});
					}
				})
			},
			add() {
				var newField = JSON.parse(JSON.stringify(this.field));
				this.newTableInfo.push(newField);
			},
			remove() {
				this.newTableInfo.pop()
			},
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
			handleDelete(index, row) {
				var that = this;
				this.$confirm('此操作将永久删除该数据表, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios.delete("/db/table/del/" + that.form.dbName + "/" + row).then(function(res) {
						if (res.data.status == "ok") {
							that.$notify({
								title: '删除成功',
								message: "删除表-" + that.form.dbName + '.' + row,
								type: 'success'
							});
							that.findTableList(that.form.dbName)
						} else {
							that.$notify.error({
								title: '删除失败',
								message: res.data.message
							});
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			toTableInfo(value) {
				this.tableInfo.colNameList = []
				this.tableInfo.colTypeList = []
				this.tableInfo.defaultValueList = []
				this.tableInfo.isNullList = []
				this.tableInfo.commentList = []
				for (var t = 0; t < value.length; t++) {
					var obj = this.newTableInfo[t];
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
			addPermission(index, row) {
				var that = this;
				this.$prompt('请输入授权用户wxid', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({value}) => {
					this.addPermissionInfo.toUser = value;
					var newObj = {
						"dbName": this.form.dbName,
						"tableName": row
					}
					this.addPermissionInfo.tables.push(newObj);
					this.$axios.post("/db/table/authorization", this.addPermissionInfo).then(function(res) {
						if (res.data.status == "ok") {
							that.$notify({
								title: '授权成功',
								message: that.form.dbName + '.' + row + res.data.message,
								type: 'success'
							});
							that.findTableList(that.form.dbName)
						} else {
							that.$notify.error({
								title: '授权失败',
								message: res.data.message
							});
						}
					})
					this.addPermissionInfo = {
											"toUser": "",
											"tables": []
											}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
			},
			delPermission(index, row) {
				var that = this;
				this.$prompt('请输入目标用户wxid', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({value}) => {
					this.addPermissionInfo.toUser = value;
					var newObj = {
						"dbName": this.form.dbName,
						"tableName": row
					}
					this.addPermissionInfo.tables.push(newObj);
					this.$axios.post("/db/table/authorization/del", this.addPermissionInfo).then(function(res) {
						if (res.data.status == "ok") {
							that.$notify({
								title: '取消成功',
								message: that.form.dbName + '.' + row + res.data.message,
								type: 'success'
							});
							that.findTableList(that.form.dbName)
						} else {
							that.$notify.error({
								title: '取消失败',
								message: res.data.message
							});
						}
					})
					this.addPermissionInfo = {
											"toUser": "",
											"tables": []
											}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
			},
			addToES(index, row) {
				var that = this;
				this.$confirm('添加ES会导致压力过大，请判断是否有必要添加监控, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios.put("/db/table/monitor/" + that.form.dbName + "/" + row).then(function(res) {
						if (res.data.status == "ok") {
							that.$notify({
								title: '添加成功',
								message: "监控表-" + that.form.dbName + '.' + row,
								type: 'success'
							});
							that.findTableList(that.form.dbName)
						} else {
							that.$notify.error({
								title: '添加失败',
								message: res.data.message
							});
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},
			flushAllToES(index, row) {
				var that = this;
				this.$confirm('是否同步全量数据?可能造成ES瞬时压力过大', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios.get("/db/table/flush/" + that.form.dbName + "/" + row).then(function(res) {
						if (res.data.status == "ok") {
							that.$notify({
								title: '开始同步,结果通过QQ群告警',
								message: "表-" + that.form.dbName + '.' + row,
								type: 'success'
							});
							that.findTableList(that.form.dbName)
						} else {
							that.$notify.error({
								title: '同步失败',
								message: res.data.message
							});
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			}
		}
	}
</script>
