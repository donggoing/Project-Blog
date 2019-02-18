<template>
    <el-menu id="menu" :default-active="this.$route.path.replace('/','')" class="el-menu-demo" mode="horizontal" router>
        <el-menu-item v-if="this.$store.getters.roles.indexOf('admin')===-1" index="allblogs">博客园</el-menu-item>
        <el-menu-item v-else index="manageblogs">管理博客</el-menu-item>
        <el-menu-item index="home">我的博客</el-menu-item>
        <el-menu-item index="newblog">写博客</el-menu-item>
        <el-menu-item index="mycomments">我的评论</el-menu-item>
        <el-submenu index="" style="float:right">
        <template slot="title">{{this.$store.getters.username}}</template>
            <!-- <el-menu-item index="Info">个人信息</el-menu-item> -->
            <el-menu-item index="" @click="logout">退出</el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
export default {
    name:"Menu",
    methods:{
        logout(){
            this.$http.get('/logout').then(
                res=>{
                    this.$store.dispatch('SetUser',null)
                    this.$message("成功退出")
                    this.$router.push('/login')
                },
                err=>{
                console.log(err);
                }
            )
            
        }
    }
}
</script>

<style scoped>
    #menu{
        margin:0 0 20px 0
    }
</style>


    