<template>
    <div id="newblog">
        <div id="container">
            <div id="title-container">
                <!-- <el-button v-on:click="$router.go(-1)" id='return'>←返回</el-button> -->
                <label for='title'>标题</label>
                <el-input id="title" style="width:350px" tabindex="1" type="text" placeholder="输入新博客标题" v-model="title"/>
                <el-button id="submit" tabindex="2" @click="submit">提交新博客
                </el-button>
            </div>
            <hr>
            <h2>内容编辑</h2>
            <Edit blogcontent="" ref="edit"/>
        </div>
    </div>
</template>

<script>
import Edit from '@/components/Edit'
import Menu from '@/components/NavMenu'
export default {
    name: "NewBlog",
    data() {
        return {
            title:'',
            content:'',
            changed:false
        }
    },
     beforeRouteLeave(to, from, next) {
        const answer = window.confirm('是否确定要离开编辑？')
        if (answer) {
        next()
        } else {
        next(false)
        }
    },
    components:{Edit,Menu}
    ,
    mounted() {
    let _this = this
        window.onbeforeunload = function (e) {
            if(_this.$route.path =="/newblog"){
                e = e || window.event;
                // 兼容IE8和Firefox 4之前的版本
                if (e) {
                    e.returnValue = '请确认博客已提交或备份~';
                }
                // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
                return '请确认博客已提交或备份~';
            }else{
                window.onbeforeunload =null
            }
        }
    },
    methods:{
        submit(){
            var title=this.title
            var blog=this.$refs.edit.content
            var data={
                title:title,
                newblog:blog
            }
            if(!title.match(/^ *$/)){
                if(!blog.match(/^ *$/)){
                this.$http.post("/api/"+this.$store.getters.username+'/newblog',data)
                .then(
                    res=>{
                        if(res.data.message){
                            this.$message(res.data.message)
                            if(res.data.success){
                                this.$router.push({path:'/blog',query:{blog_id:res.data.blog_id}})
                            }
                        }
                    },
                    err=>{
                        console.log(err)
                        this.$message('提交失败，请重试，若仍不成功请做好备份稍后再试~')
                    })
                }else{
                    this.$message("正文请勿输入空白~")
                }
            }else{
                this.$message("标题请勿输入空白~")
            }
        }
    }
}
</script>

<style scoped>

    #container{
        width:94%;
        margin:0 auto;
        min-width: 700px;
        height: 650px;
    }

    h2{
        text-align: center
    }

    #return{
        text-align: left;
        position:absolute;
        left:20px;
    }

    #title-container{
        text-align: center;
        margin:0 auto;
    }


</style>
