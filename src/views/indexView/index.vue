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
                        <div v-for="o in newsHeadlines" :key="o" class="text item">
                            <el-col :span="14" class="news-row">
                                <el-link type="success" v-if="o.hId != '置顶'" @click="toWebo(o.hTitle)">{{ o.hTitle.length > 13 ? o.hTitle.substring(0,13)+ "..." : o.hTitle }}</el-link>
                                <el-link type="success" v-if="o.hId == '置顶'" @click="toWebo(o.hTitle)">🔝{{ o.hTitle.length > 13 ? o.hTitle.substring(0,13)+ "..." : o.hTitle }}</el-link>
                            </el-col>
                            <el-col :span="3" class="news-row">
                                <el-tag v-if="o.hId != '置顶'" size="mini"><i class="el-icon-medal"></i>{{ o.hId }}</el-tag>
                                <el-tag v-if="o.hId == '置顶'" size="mini">{{ "置顶" }}</el-tag>
                            </el-col>
                            <el-col :span="5" class="news-row">
                                <el-tag size="mini"  v-if="o.hId != '置顶'"  effect="danger"><i class="el-icon-data-line"></i>{{ "热度" + o.hHot }} </el-tag>
                                <el-tag size="mini"  v-if="o.hId == '置顶'"  effect="danger">{{ "置顶" }} </el-tag>
                            </el-col>
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
            this.$axios.get("/news/list?&pageSize=20&pageNum=1").then(function (res) {
                if (res.data.status == "ok") {
                    that.newsHeadlines = res.data.data.list;
                }
            })
        },
        toWebo(s){
            var link = "https://s.weibo.com/weibo?q="+encodeURIComponent(s)+"&Refer=top"
            window.open(link)
        }

    }
}
</script>

<style>
    .news-row{
        margin-top: 3px;
        margin-bottom: 5px;
    }
</style>
