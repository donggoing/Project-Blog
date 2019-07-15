<template>
    <div>
        <a href='' v-on:click='logout' >退出</a><br/>
        <router-link :to="{path:'/manageblogs'}" >管理博客及评论</router-link>
    </div>
</template>

<script>
import Menu from '@/components/NavMenu'
export default {
    name:'homeforadmin',
    data(){
        return{

        }
    },
    components:{Menu},
    methods:{
        logout(){
            this.$http.get('/logout').then(
                res=>{
                    this.$message("成功退出");
                },
                err=>{
                    console.log(err);
                })
            this.$store.dispatch('SetUser',null)
            this.$router.push('/login');
        }
    }
}
    
</script>

<style scoped>

</style>


