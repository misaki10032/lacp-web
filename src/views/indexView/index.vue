<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="16" offset="1">
                <div class="bg-green">
                    <el-skeleton :rows="22" />
                </div>
            </el-col>
            <el-col :span="6">
                <div class="bg-green">
                    <el-card class="box-card" style="padding-bottom:25px">
                        <div slot="header" class="clearfix">
                            <span>小时热度新闻(小时刷新)</span>
                        </div>
                        <div>
                            <el-table :data="newsHeadlines" :stripe="true" size="mini">
                                <el-table-column :show-overflow-tooltip='true' label="头条" width="200">
                                    <template slot-scope="scope">
                                        <el-link type="danger" @click="toWebo(scope.row.hTitle)">{{ scope.row.hTitle }}</el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column label="排行" width="50">
                                    <template slot-scope="scope">
                                        <el-tag v-if="scope.row.hId != '置顶'" size="mini"><i class="el-icon-medal"></i>{{scope.row.hId}}</el-tag>
                                        <el-tag v-if="scope.row.hId == '置顶'" size="mini">{{ "置顶" }}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column label="热度">
                                    <template slot-scope="scope">
                                        <el-tag size="mini" v-if="scope.row.hId != '置顶'" effect="danger">
                                            <i class="el-icon-data-line"></i>{{ scope.row.hHot }}
                                        </el-tag>
                                        <el-tag size="mini" v-if="scope.row.hId == '置顶'" effect="danger">{{ "置顶" }}</el-tag>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data() {
        return {
            newsHeadlines: []
        };
    },
    mounted() {
        this.getNowNewHeadlines();
    },
    methods: {
        getNowNewHeadlines() {
            var that = this;
            this.$axios.get("/news/list?&pageSize=11&pageNum=1").then(function (res) {
                if (res.data.status == "ok") {
                    that.newsHeadlines = res.data.data.list;
                }
            })
        },
        toWebo(s) {
            var link = "https://s.weibo.com/weibo?q=" + encodeURIComponent(s) + "&Refer=top"
            window.open(link)
        }

    }
}
</script>

<style>
</style>
