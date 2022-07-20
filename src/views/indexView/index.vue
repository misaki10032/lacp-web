<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="16" :offset="1">
                <div class="bg-green">
                    <div id="monaco-editor" style="height:450px;border:2px solid #d9cfcf;">{{ editor.value }}</div>
                    <!-- <el-input type="textarea" :rows="2" placeholder="编写你的Java代码"
                        :autosize="{ minRows: 22, maxRows: 22 }" v-model="javaCode"></el-input> -->
                    <el-button style="margin-top: 10px;" type="primary" plain @click="execute()">执行</el-button>
                    <el-input type="textarea" :rows="2" placeholder="结果" disabled :autosize="{ minRows: 9, maxRows: 9 }"
                        v-model="res"></el-input>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="bg-green">
                    <el-card class="box-card" style="padding-bottom:25px">
                        <div>
                            <el-table :data="newsHeadlines" :stripe="true" size="mini">
                                <el-table-column :show-overflow-tooltip='true' label="头条内容(小时刷新)" width="200">
                                    <template slot-scope="scope">
                                        <el-link type="danger" @click="toWebo(scope.row.hTitle)">{{ scope.row.hTitle }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column label="排行" width="50">
                                    <template slot-scope="scope">
                                        <el-tag v-if="scope.row.hId != '置顶'" size="mini"><i class="el-icon-medal"></i>{{
                                                scope.row.hId
                                        }}</el-tag>
                                        <el-tag v-if="scope.row.hId == '置顶'" size="mini">{{ "置顶" }}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column label="热度">
                                    <template slot-scope="scope">
                                        <el-tag size="mini" v-if="scope.row.hId != '置顶'" effect="danger">
                                            <i class="el-icon-data-line"></i>{{ scope.row.hHot }}
                                        </el-tag>
                                        <el-tag size="mini" v-if="scope.row.hId == '置顶'" effect="danger">{{ "置顶" }}
                                        </el-tag>
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
import * as monaco from 'monaco-editor'
export default {
    data() {
        return {
            newsHeadlines: [],
            javaCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"i am you father\");\n    }\n}",
            res: "",
            editor: {}
        };
    },
    mounted() {
        this.getNowNewHeadlines();
        this.editor = monaco.editor.create(document.getElementById('monaco-editor'), {
			value:  '// 请在下方输入您的java语句 \n' 
					+'// 编辑器暂不支持复杂的工具类操作 \n'
					+'// 示例：\n'
                    +'public class Main {\n    public static void main(String[] args) {\n        System.out.println("i am you father");\n    }\n}',
			language: 'java',
			automaticLayout: true
		})
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
        },
        execute() {
            var that = this;
            console.log(this.javaCode)
            this.javaCode = this.editor.getValue();
            this.$axios.post("/tools/java/run", this.javaCode , {
                headers: { 'Content-Type': 'application/json' }
            }).then(function (res) {
                if (res.data.compileRes == "编译成功") {
                    that.res = res.data.runRes;
                } else {
                    that.res = res.data.errorDiagnosticMsg;
                }

            })
        }

    }
}
</script>

<style>
</style>
