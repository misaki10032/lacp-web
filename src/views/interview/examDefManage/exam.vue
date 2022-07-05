<template>
    <div>
        <el-breadcrumb style="margin-bottom: 20px">
            <el-breadcrumb-item :to="{ path: '/welcome' }">主站</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/itvexamdef' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/itvexamdef' }">题库管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
            <el-input v-model="form.search" placeholder="请输入题名" @change="findLabelList(1, 10)"
                      style="width: 18.75rem;margin-right: 20px;" clearable></el-input>
            <el-button type="primary" v-if="ssocontrol" @click="dialogFormVisible = true">新增题库</el-button>
        </div>
        <div>
            <el-table v-loading="this.labels.length > 0 ? false : true" element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading" :data="labels" style="width: 100%;"
                      ref="multipleTable">
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
                <el-table-column label="是否显示">
                    <template slot-scope="scope">
                        <el-switch @change="changeAble(scope.row)" inactive-color="red"
                                   v-model="scope.row.showAble"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="是否启用">
                    <template slot-scope="scope">
                        <el-switch @change="changeAble(scope.row)" inactive-color="red"
                                   v-model="scope.row.enAble"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="修改人" prop="values.modifier.value" width="200"
                                 :sortable="true"></el-table-column>
                <el-table-column label="修改日期" prop="values.modifiedTime.value" width="200"
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

        <el-dialog center width="440px" modal title="新增题库" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="题库名称" required>
                    <el-input style="width: 310px;" clearable placeholder="请输入内容" show-word-limit maxlength="15"
                              prefix-icon="el-icon-receiving" v-model="title"></el-input>
                </el-form-item>
                <el-form-item label="题库类型" required>
                    <el-select style="width: 310px;" multiple filterable clearable collapse-tags v-model="values"
                               placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item required label="是否显示">
                    <el-switch v-model="enAble" inactive-color="red"></el-switch>
                </el-form-item>
                <el-form-item required label="是否启用">
                    <el-switch inactive-color="red" v-model="showAble"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addExam()">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                enAble: true,
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
                ssocontrol: false,
                title: ""
            }
        },
        mounted() {
            this.findLabelList(1, this.pageInfo.pageSize);
        },
        methods: {
            findLabelList(page, limit) {
                this.form.pageNum = page;
                this.form.pageSize = limit;
                this.$axiositv.get("/edc/queryAllExam/" + this.form.pageNum + "/" + this.form.pageSize).then(res => {
                    if (res.data.responseState === 200) {
                        this.ssocontrol = res.data.responseData.ssoadmin
                        this.labels = res.data.responseData.tagsList;
                        if (res.data.responseData.pageInfo == null) {
                            this.pageInfo.total = 0;
                        } else {
                            this.pageInfo.total = res.data.responseData.pageInfo.total;
                        }
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
            changeAble(row) {
                this.$axiositv.post("/edc/updateExam", {
                    id: row.refpk,
                    labelPk: row.values.label.value,
                    title: row.refname,
                    showAble: row.showAble,
                    modifier: window.sessionStorage.getItem("sso_uid"),
                    enAble: row.enAble
                }).then(res => {
                    if (res.data.responseState === 200) {
                        this.$notify({
                            title: '更新成功',
                            message: "更新-" + row.refname,
                            type: 'success'
                        });
                        this.findLabelList(this.pageInfo.pageNum, this.pageInfo.pageSize);
                    } else {
                        this.$notify.error({
                            title: '更新成功',
                            message: res.data.responseMessage
                        });
                    }
                })
            },
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axiositv.get("/edc/deleteExam/" + row.refpk).then(res => {
                        if (res.data.responseState === 200) {
                            this.$notify({
                                title: '删除成功',
                                message: "删除-" + row.refname,
                                type: 'success'
                            });
                            this.findLabelList(this.pageInfo.pageNum, this.pageInfo.pageSize)
                        } else {
                            this.$notify.error({
                                title: '删除失败',
                                message: res.data.responseMessage,
                                type: 'error'
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
            addExam() {
                var labekPk = this.values[0]
                if (this.values.length > 1) {
                    for (let i = 1; i < this.values.length; i++) {
                        labekPk += ","
                        labekPk += this.values[i]
                    }
                }
                // labekPk = labekPk.substr(0, labekPk.length - 1)
                console.log(labekPk)
                console.log(this.title)
                this.$axiositv.post("/edc/insertExam", {
                    labelPk: labekPk,
                    title: this.title,
                    showAble: this.showAble,
                    enAble: this.enAble
                }).then(res => {
                    if (res.data.responseState === 200) {
                        this.$notify({
                            title: '新建成功',
                            message: "新增-" + this.title,
                            type: 'success'
                        });
                        this.dialogFormVisible = false
                        this.title = ""
                        this.values = ""
                        this.findLabelList(this.pageInfo.pageNum, this.pageInfo.pageSize);
                    } else {
                        this.$notify.error({
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

</style>
