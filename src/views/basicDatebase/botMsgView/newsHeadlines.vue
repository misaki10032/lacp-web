<template>
    <div>
        <el-breadcrumb style="margin-bottom: 20px">
            <el-breadcrumb-item :to="{ path: '/welcome' }">主站</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/mainlist' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/newsheadlines' }">头条数据管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
            <el-select v-model="form.date" clearable placeholder="请选择日期" @change="findNewList(1, 10);">
                <el-option v-for="item in options" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
        </div>
        <div>
            <el-table :data="newsHeadlines" style="width: 100%;" ref="multipleTable">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column fixed label="头条ID" prop="id" sortable width="90"></el-table-column>
                <el-table-column fixed label="排行" prop="hId" sortable width="90"></el-table-column>
                <el-table-column label="头条内容" :show-overflow-tooltip='true' prop="hTitle" :formatter="typeformat" width="200"></el-table-column>
                <el-table-column label="类型｜热度" :show-overflow-tooltip='true' prop="hHot" width="120"></el-table-column>
                <el-table-column label="日期" prop="hDate" width="150"></el-table-column>
                <el-table-column label="创建日期" prop="createTime" width="200" :sortable="true"></el-table-column>
                <el-table-column label="修改日期" prop="updateTime" width="200" :sortable="true"></el-table-column>
            </el-table>
            <el-pagination :current-page="pageInfo.currentPage" :page-size="pageInfo.pageSize"
                :page-sizes="[3, 7, 10, 20]" :total="pageInfo.total" layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>

</template>

<script>
export default {
    data() {
        return {
            form: {
                date: "",
                pageNum: "",
                pageSize: ""
            },
            newsHeadlines: [],
            options: [],
            pageInfo: {
                total: 10,
                currentPage: 1,
                pageNum: 1,
                pageSize: 10
            }
        }
    },
    mounted() {
        this.findDateList();
        this.findNewList(1, this.pageInfo.pageSize);
    },
    methods: {
        findNewList(page, limit) {
            var that = this;
            that.form.pageNum = page;
            that.form.pageSize = limit;
            this.$axios.get("/news/list?date=" + that.form.date + "&pageSize=" + that.form.pageSize + "&pageNum=" + that.form.pageNum).then(function (res) {
                if (res.data.status == "ok") {
                    that.newsHeadlines = res.data.data.list;
                    that.pageInfo.total = res.data.data.total;
                }
            })
        },
        handleSizeChange(val) {
            this.pageInfo.pageSize = val;
            this.findNewList(this.pageInfo.pageNum, this.pageInfo.pageSize);
        },
        handleCurrentChange(val) {
            this.pageInfo.pageNum = val;
            this.findNewList(this.pageInfo.pageNum, this.pageInfo.pageSize);
        },
        findDateList() {
            var that = this;
            this.$axios.get("/news/date/list").then(function (res) {
                if (res.data.status == "ok") {
                    that.options = res.data.data;
                }
            })
        },

    }
}
</script>
