<template>
    <div id="blog">
        <div id="container">
            <h1>{{blog.title}}</h1>
            <p class="date">首次提交：{{blog.postDate}}</p>
            <p class="date">最新提交：{{blog.lastPostDate}}</p>
            <el-button v-if="blog.postUser===$store.getters.username" 
                id="modify" 
                @click="modify">
                修改
            </el-button>
            <hr/>
            <div id="show-content"></div>
            <hr/>
            <div id="comment-container">
                <h2>评论区</h2>
                <Comments :blog_id='blog_id'/>
            </div>
        </div>
    </div>
</template>

<script scoped>
import Comments from '@/components/Comments'
import Menu from '@/components/NavMenu'
export default {
    name:'Blog',
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
        modify(){
            this.$router.push({path:'/editblog',query:{blog_id:this.blog_id}})
        }
    }
}
</script>

<style scoped>
    #blog{
        text-align: left;
    }

    #return{
        font-size:20px
    }

    #container{
        width:80%;
        margin:0 auto
    }

    #modify{
        display: inline;
        background-color: beige;
    }

    #show-content{
        background-color: rgba(250,250,250,.85);
        width:100%;
        min-width:800px;
        
    }

    .date{
        color:grey;
        text-align: left;
        font-size:15px
    }
    #comment-container{
        margin-top:50px;
        position: relative;
    }

</style>
