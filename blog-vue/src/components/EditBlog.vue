<template>
    <div id="editblog">
        <Menu></Menu>
        <div id="container">
            <el-button v-on:click="returnBlog" id='return'>←返回</el-button>
            <div v-if="success">
                <h1 id="title">{{title}}</h1>
                <el-button id="submit" @click="submit">提交</el-button>
                <Edit v-if="content!==''" :blogcontent="content" ref="edit">
                </Edit>
            </div>
            <p v-else>博客获取失败，请刷新重试~</p>
        </div>
    </div>
</template>

<script>
import Edit from '@/components/Edit'
import Menu from '@/components/NavMenu'
export default {
    name: "EditBlog",
    data() {
        return {
            title:'', 
            content:'',
            success:true
        }
    },
    components:{Edit,Menu},
    created() {
        this.blog_id=this.$route.query.blog_id
        this.$http.get('/api/getblog/'+this.blog_id).then(
            res=>{
                if(res.data.success){
                    this.title=res.data.data.title
                    this.content=res.data.data.content
                }
                else success=false
            },
            err=>{
                console.log(err)
            }
        )
    },
    mounted() {
        let _this = this
        //离开提示
        window.onbeforeunload = function (e) {
            if(_this.$route.path =="/editblog"){
                e = e || window.event;
                // 兼容IE8和Firefox 4之前的版本
                if (e) {
                    e.returnValue = '请确认博客已提交或备份~';
                    return
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
            var data={
                newtitle:this.title,
                newcontent:this.$refs.edit.content,
                user:this.$store.getters.username
            }
            this.$http.post('/api/'+this.blog_id+'/updateblog',data).then(
                res=>{
                    if(res.data.message){
                        this.$message(res.data.message)
                        if(res.data.success){
                            this.$router.push({path:'/blog',query:{blog_id:this.blog_id}})
                        }
                    }
                },
                err=>{
                    console.log(err)
                    this.$message('提交失败，请重试，若仍不成功请做好备份稍后再试~')
                }
            )
        },
        returnBlog(){
            this.$router.push({path:'/blog',query:{blog_id:this.blog_id}})
        }
    }

}
</script>

<style scoped>
    #editblog{
        margin:0 auto;
        text-align: left;
    }
    
    #container{
        width:94%;
        margin:0 auto;
        min-width: 700px;
        position: relative;
    }

    #title{
        text-align: center;
        margin:10px
    }

    #submit{
        position: absolute;
        right: 3%;
        top:55px;
    }

</style>
