<template>
    <div id="blog">
        <router-link :to="{path:'/manageblogs'}"><p id='return'>←返回</p></router-link>
        <h1>{{blog.title}}</h1>
        <p class="date">首次提交：{{blog.postDate}}</p>
        <p class="date">最新提交：{{blog.lastPostDate}}</p>
        <div v-if="blog.hidden">
            <p class="beHidden">博客已被管理员隐藏.</p>
            <el-button class="green" @click="Toggle(blog)">恢复</el-button>
        </div>
        <el-button v-else @click="Toggle(blog)">隐藏</el-button>
        <hr>
            <div id="show-content"></div>
        <hr>
        
        <div id="comment-container">
            <h2>评论区</h2>
            <Comments :blog_id='blog_id'/>
        </div>
    </div>
</template>

<script>
import Comments from '@/components/ManageComment'
import Menu from '@/components/NavMenu'
export default {
    name:'manageablog',
    data(){
        return{
            blog_id:null,
            blog:{}
        }
    },
    components:{Comments,Menu},
    created(){
        this.blog_id=this.$route.query.blog_id
        this.$http.get('/api/getblog/'+this.blog_id).then(
            res=>{
                res.data.data.postDate=this.$moment(this.$moment.utc(res.data.data.postDate).toDate()).format('YYYY-MM-DD HH:mm:ss')
                res.data.data.lastPostDate=this.$moment(this.$moment.utc(res.data.data.lastPostDate).toDate()).format('YYYY-MM-DD HH:mm:ss')
                this.blog=res.data.data
                var html=this.converter.makeHtml(this.blog.content)
                document.getElementById('show-content').innerHTML=html
            },
            err=>{
                console.log(err)
            }
        )
    }
    ,
    methods:{
        Toggle(){
            this.$http.post('/api/A/toggleblog',
            {blog_id:this.blog_id,state:this.blog.hidden}).then(
                res=>{
                    this.$message(res.data.message)
                        if(res.data.success)this.blog.hidden=!this.blog.hidden
                },
                err=>{
                    console.log(err)
                    this.$message("失败~请重试~")
                }
            )
        }
    }
}
</script>

<style scoped>
    #blog{
        margin:0 auto;
        padding-left: 20px;
        text-align: left;
        width:80%;
        min-width: 700px;
        border-left: 1px solid grey
    }

    #return{
        font-size:20px
    }

    #hidden{
        display: inline;
        background-color: beige;
    }

    #show-content{
        width:100%;
        min-width:1200px;
        min-height:200px
    }

    .date{
        color:grey;
        text-align: left;
        font-size:15px
    }

</style>
