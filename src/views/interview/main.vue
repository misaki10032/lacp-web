<template>
    <div class="hello" style="height: 100%;background-color: #ffffff;">
        <el-container style="height: 53rem; border: 1px solid #e5e5e5">
            <el-aside style="height: 100%;background-color: #ffffff;color: white;" width="250px">
                <el-menu router style="height: 52rem;">
                    <div style="height: 21px;text-align: center;padding: 20px 0 20px 0;background-color: #545c64;">
                        <h1 @click="toMainList"><i class="el-icon-s-help"></i>面试模块</h1>
                    </div>
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-paperclip"></i>题库管理</template>
                        <el-menu-item-group>
                            <template slot="title">exam</template>
                            <el-menu-item index="/itvexamdef">题库管理</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-s-data"></i>内容管理</template>
                        <el-menu-item-group>
                            <template slot="title">value</template>
                            <el-menu-item index="/db">内容管理</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>

            <el-container>
                <el-main style="height: 100%;padding-top:3.25rem;">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
    export default {

        data() {
            return {
                num: sessionStorage.getItem("num"),
                isRoot: true,
                isSuper: true
            }
        },
        mounted() {
            var level = sessionStorage.getItem("level");
            if (level == "root") {
                this.isSuper = false;
                this.isRoot = false;
            } else if (level == "super") {
                this.isSuper = false;
                this.isRoot = true;
            }
        },
        methods: {
            toMainList() {
                this.$router.push("/itvmain")
            },
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            logOut() {
                sessionStorage.clear();
                this.$router.push("/login");
            }
        }
    };
</script>

<style>
    * {
        padding: 0;
        margin: 0;
    }

    .el-header {
        background-color: #796bf0;
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        color: #333;
    }

    .levelInsufficient {
        display: none;
    }
</style>
