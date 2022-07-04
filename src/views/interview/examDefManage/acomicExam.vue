<template>
    <div>
        <el-breadcrumb style="margin-bottom: 20px">
            <el-breadcrumb-item :to="{ path: '/welcome' }">主站</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/mainlist' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/itvexamdef' }">原子标签题库</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
            <el-input v-model="form.search" placeholder="请输入题名" @change="findLabelList(1, 10)"
                      style="width: 18.75rem;margin-right: 20px;" clearable></el-input>
            <el-button type="primary" @click="dialogFormVisible = true">新增原子标签题库</el-button>
            <el-button type="danger" @click="getSelectionDel()">删除</el-button>
        </div>
        <div>
            <el-table :data="labels" style="width: 100%;" ref="multipleTable">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column fixed label="题ID" prop="refpk" sortable width="100"></el-table-column>
                <el-table-column label="题名" prop="refname" width="150"></el-table-column>
                <el-table-column width="200" label="题类型">
                    <template slot-scope="scope">
                        <el-tag type="success">
                            {{ scope.row.values.label.display }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建日期" prop="values.modifiedTime.value" width="200"
                                 :sortable="true"></el-table-column>
                <el-table-column label="修改日期" prop="values.modifier.value" width="200"
                                 :sortable="true"></el-table-column>
                <el-table-column label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :current-page="pageInfo.currentPage" :page-size="pageInfo.pageSize"
                           :page-sizes="[3, 7, 10, 20]" :total="pageInfo.total"
                           layout="total, sizes, prev, pager, next, jumper"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
        </div>

        <el-dialog center width="440px" modal title="新增题" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="题库名称" :label-width="formLabelWidth" required>
                    <el-input style="width: 310px;" clearable placeholder="请输入内容" show-word-limit maxlength="15" prefix-icon="el-icon-receiving" v-model="title"></el-input>
                </el-form-item>
                <el-form-item label="题库类型" required :label-width="formLabelWidth">
                    <el-select style="width: 310px;" multiple filterable clearable  collapse-tags v-model="values" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item required label="是否显示">
                    <el-switch v-model="enable" inactive-color="red"></el-switch>
                </el-form-item>
                <el-form-item required label="是否停用">
                    <el-switch inactive-color="red" v-model="showAble"></el-switch>
                </el-form-item>
            </el-form>
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
                enable: true,
                showAble: true,
                form: {
                    search: "",
                    type: 1,
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
                values: [],
                options: [{
                    value: '1',
                    label: 'java'
                }, {
                    value: '2',
                    label: 'mysql'
                }, {
                    value: '3',
                    label: 'python'
                }, {
                    value: '4',
                    label: 'python'
                }, {
                    value: '5',
                    label: 'php'
                }],
                dialogFormVisible: false,
                title: ""
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
                this.$axios.get("/edc/queryAllExam/" + this.form.pageNum + "/" + this.form.pageSize).then(function (res) {
                    if (res.data.responseState == 200) {
                        that.labels = res.data.responseData.tagsList;
                        that.pageInfo.total = res.data.responseData.pageInfo.total;
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
                this.$axios.post("/label/add/bulk/atomic?" + putParam).then(function (res) {
                    if (res.data.status == "ok") {
                        that.$notify({
                            title: '新建成功',
                            message: "新增-" + list,
                            type: 'success'
                        });
                        that.dialogFormVisible = false
                        that.newlabel = ""
                        that.findLabelList(that.pageInfo.pageNum, that.pageInfo.pageSize);
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

<style>
    .dialiog {
        margin: 30px;
    }
</style>
