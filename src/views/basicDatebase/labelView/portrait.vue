<template>
	<div>
		<el-breadcrumb style="margin-bottom: 20px">
			<el-breadcrumb-item :to="{ path: '/welcome' }">主站</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/mainlist' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/portrait' }">原子标签</el-breadcrumb-item>
		</el-breadcrumb>
		<div>
			<el-input v-model="form.search" placeholder="请输入标签名" @change="findLabelList(1, 10)"
				style="width: 18.75rem;margin-right: 20px;" clearable></el-input>
			<el-button type="primary" @click="dialogFormVisible = true">新增画像标签</el-button>
			<el-button type="danger" @click="getSelectionDel()">删除</el-button>
		</div>
		<div>
			<el-table :data="labels" style="width: 100%;" ref="multipleTable">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column fixed label="标签ID" prop="id" sortable width="100"></el-table-column>
				<el-table-column label="标签名" prop="labelName" width="150">
					<template slot-scope="scope">
						<div v-html="scope.row.labelName"></div>
					</template>
				</el-table-column>
				<el-table-column label="标签类型" width="150">
					<el-tag type="warning">用户标签</el-tag>
				</el-table-column>
				<el-table-column label="标签来源" width="150">admin</el-table-column>
				<el-table-column label="创建日期" prop="createTime" width="200" :sortable="true"></el-table-column>
				<el-table-column label="修改日期" prop="updateTime" width="200" :sortable="true"></el-table-column>
				<el-table-column label="操作" width="250">
					<template slot-scope="scope">
						<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination :current-page="pageInfo.currentPage" :page-size="pageInfo.pageSize"
				:page-sizes="[3, 7, 10, 20]" :total="pageInfo.total" layout="total, sizes, prev, pager, next, jumper"
				@size-change="handleSizeChange" @current-change="handleCurrentChange">
			</el-pagination>
		</div>

		<el-dialog title="添加画像标签" :visible.sync="dialogFormVisible">
			<el-input v-model="newlabel" placeholder="多个用空格隔开" clearable></el-input>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="add()">确 定</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
export default {
	data() {
		return {
			form: {
				search: "",
				type: 3,
				pageNum: "",
				pageSize: ""
			},
			labels: [],
			pageInfo: {
				total: 10,
				currentPage: 1,
				pageNum: 1,
				pageSize: 10
			},
			ids: [],
			dialogFormVisible: false,
			newlabel: ""
		}
	},
	mounted() {
		this.findLabelList(1, this.pageInfo.pageSize);
	},
	methods: {
		findLabelList(page, limit) {
			var that = this;
			that.form.pageNum = page;
			that.form.pageSize = limit;
			this.$axios.get("/label/list/type?type=" + that.form.type + "&search=" + that.form.search + "&pageSize=" +
				that.form.pageSize + "&pageNum=" + that.form.pageNum).then(function (res) {
					if (res.data.status == "ok") {
						that.labels = res.data.data.list;
						that.pageInfo.total = res.data.data.total;
					}
				})
		},
		handleSizeChange(val) {
			this.pageInfo.pageSize = val;
			this.findLabelList(this.pageInfo.pageNum, this.pageInfo.pageSize);
		},
		handleCurrentChange(val) {
			this.pageInfo.pageNum = val;
			this.findLabelList(this.pageInfo.pageNum, this.pageInfo.pageSize);
		},
		handleDelete(index, row) {
			var that = this;
			this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$axios.delete("/label/del?atomicIds=" + row.id).then(function (res) {
					if (res.data.status == "ok") {
						that.$notify({
							title: '删除成功',
							message: "删除-" + row.labelName,
							type: 'success'
						});
						that.labels.splice(index, 1);
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
		getSelectionDel() {
			const list = this.$refs.multipleTable.selection;
			var ids = ""
			var nameList = []
			for (var num in list) {
				if (num != 0) {
					ids += "&";
				}
				nameList.push(list[num].labelName);
				ids += "atomicIds=" + list[num].id;
			}
			console.log(ids)
			var that = this;
			this.$confirm('此操作将永久删除[' + nameList + '], 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$axios.delete("/label/del?" + ids).then(function (res) {
					if (res.data.status == "ok") {
						that.$notify({
							title: '删除成功',
							message: "删除-" + nameList,
							type: 'success'
						});
						that.findLabelList(that.pageInfo.pageNum, that.pageInfo.pageSize);
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
		add() {
			var list = this.newlabel.split(" ")
			var putParam = ""
			for (var i in list) {
				if (i != 0) {
					putParam += "&"
				}
				putParam += "list=" + list[i]
			}
			var that = this;
			this.$axios.put("/label/add/bulk/user?" + putParam).then(function (res) {
				if (res.data.status == "ok") {
					that.$notify({
						title: '新建成功',
						message: "新增-" + list,
						type: 'success'
					});
					that.findLabelList(that.pageInfo.pageNum, that.pageInfo.pageSize);
					that.dialogFormVisible = false
					that.newlabel = ""
				} else {
					that.$notify.error({
						title: '新增失败',
						message: res.data.message
					});
				}
			})
		}
	}
}
</script>
