<template>
    <div>
        <el-breadcrumb style="margin-bottom: 20px">
            <el-breadcrumb-item :to="{ path: '/welcome' }">主站</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/mainlist' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/botmsg' }">机器人消息管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
            <el-input v-model="form.search" placeholder="请输入标签名" @change="findMsgList(1, 10)"
                style="width: 18.75rem;margin-right: 20px;" clearable></el-input>
            <el-button type="primary" @click="dialogFormVisible = true">新增消息</el-button>
            <el-button type="danger" @click="getSelectionDel()">删除</el-button>
        </div>
        <div>
            <el-table :data="msgs" style="width: 100%;" ref="multipleTable">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column fixed label="标签ID" prop="id" sortable width="90"></el-table-column>
                <el-table-column label="消息类型" prop="msgType" :formatter="typeformat" width="100"></el-table-column>
                <el-table-column label="消息内容" :show-overflow-tooltip='true' prop="msgData" width="400">
                </el-table-column>
                <el-table-column label="创建人" prop="createUser" width="100"></el-table-column>
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

        <el-dialog title="新增消息" :visible.sync="dialogFormVisible">
            <el-select v-model="newType" clearable placeholder="请选择类型">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-input type="textarea" :rows="2" placeholder="请输入内容，一个消息一行" v-model="newInput">
            </el-input>
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
                type: "",
                pageNum: "",
                pageSize: ""
            },
            msgs: [],
            pageInfo: {
                total: 10,
                currentPage: 1,
                pageNum: 1,
                pageSize: 10
            },
            ids: [],
            dialogFormVisible: false,
            newInput: "",
            newMsg: [],
            options: [{
                value: '0',
                label: '健康提醒'
            }, {
                value: '1',
                label: '早安提醒'
            }, {
                value: '2',
                label: '晚安提醒'
            }],
            newType: ''
        }
    },
    mounted() {
        this.findMsgList(1, this.pageInfo.pageSize);
    },
    methods: {
        typeformat(row, column, cellValue) {
            var res = "";
            switch (cellValue) {
                case 0:
                    res = "健康提醒";
                    break;
                case 1:
                    res = "早安提醒";
                    break;
                case 2:
                    res = "晚安提醒";
                    break;
                default:
                    res = "未知类型";
                    break;
            }
            return res;
        },
        findMsgList(page, limit) {
            var that = this;
            that.form.pageNum = page;
            that.form.pageSize = limit;
            this.$axios.get("/botmsg/list?type=" + that.form.type + "&search=" + that.form.search + "&pageSize=" +
                that.form.pageSize + "&pageNum=" + that.form.pageNum).then(function (res) {
                    if (res.data.status == "ok") {
                        that.msgs = res.data.data.list;
                        that.pageInfo.total = res.data.data.total;
                    }
                })
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val;
            this.findMsgList(this.pageInfo.pageNum, this.pageInfo.pageSize);
        },
        handleCurrentChange(val) {
            this.pageInfo.pageNum = val;
            this.findMsgList(this.pageInfo.pageNum, this.pageInfo.pageSize);
        },
        handleDelete(index, row) {
            var that = this;
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete("/botmsg/del?ids=" + row.id).then(function (res) {
                    if (res.data.status == "ok") {
                        that.$notify({
                            title: '删除成功',
                            message: "删除-" + row.id,
                            type: 'success'
                        });
                        that.msgs.splice(index, 1);
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
                nameList.push(list[num].id);
                ids += "ids=" + list[num].id;
            }
            console.log(ids)
            var that = this;
            this.$confirm('此操作将永久删除[' + nameList + '], 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete("/botmsg/del?" + ids).then(function (res) {
                    if (res.data.status == "ok") {
                        that.$notify({
                            title: '删除成功',
                            message: "删除-" + nameList,
                            type: 'success'
                        });
                        that.findMsgList(that.pageInfo.pageNum, that.pageInfo.pageSize);
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
            var list = this.newInput.split("\n")
            for (var i in list) {
                this.newMsg.push(list[i])
            }
            console.log(this.newMsg);
            console.log(this.newType);
            var that = this;
            this.$axios.post("/botmsg/add/" + that.newType, that.newMsg).then(function (res) {
                if (res.data.status == "ok") {
                    that.$notify({
                        title: '新建成功',
                        message: "新增-" + list,
                        type: 'success'
                    });
                    that.dialogFormVisible = false
                    that.newInput = ""
                    that.newMsg = []
                    that.findMsgList(that.pageInfo.pageNum, that.pageInfo.pageSize);
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
