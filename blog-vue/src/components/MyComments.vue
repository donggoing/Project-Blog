<template>
    <div id="mycomments">
        <Menu></Menu>
        <div id="container">
            <div v-if="!empty" id="comments">
                <div class="comment_container" v-for="comment in comments" :key="comment">
                    <div class="comment">
                        <p>内容:</p>
                        <p class="comment_content">{{comment.content}}</p>
                        <p class="date">评论时间:{{comment.postDate}}</p>
                    </div>
                    <p v-if="comment.hidden">请注意，该评论已被管理员隐藏.</p>
                    <div class="toblog">
                        <p class="to">To:</p>
                        <div v-if="!comment.blog_id.hidden" class="blog">
                            <h2><a class="title" href="" @click="toBlog(comment.blog_id._id)">
                                {{comment.blog_id.title}}</a></h2>
                            <p class="date">首次提交时间：{{comment.blog_id.postDate}}</p>
                            <p class="date">最新提交时间：{{comment.blog_id.lastPostDate}}</p>
                               
                        </div> 
                        <div v-else class="beHidden">
                            <p>请注意，该博客已被管理员隐藏.</p>
                        </div>    
                    </div>
                </div>
            </div>
            <p v-else id="empty">未对博客进行过评论~去博客园看看吧~</p>
            <el-pagination id="pagination" class="fy"
            layout="total, prev, pager, next, jumper"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="current_change"
            :total="total"
            background
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import Menu from '@/components/NavMenu'
export default {
    name:'MyComments',
    data(){
        return {
            total:0,
            pageSize:5,
            currentPage:1,
            comments:[],
            refreshTime:null,
            empty:true
        }
    },
    watch:{
        'currentPage':'getdata'
    },
    mounted() {
        this.getdata()
    },
    components:{Menu},
    methods:{
        current_change:function(currentPage){
            this.currentPage = currentPage;
        },
        toBlog(id){
            this.$router.push({path:"/blog",query:{blog_id:id}})
        },
        getdata(){
            this.$http.post('/api/getcomments',
            {page:this.currentPage,limit:this.pageSize})
            .then(
                res=>{
                    if(res.data.success){
                        this.total=res.data.count
                        for(var i=0;i<res.data.comments.length;i++){
                        res.data.comments[i].postDate=this.$moment(this.$moment.utc(res.data.comments[i].postDate).toDate()).format('YYYY-MM-DD HH:mm:ss')
                        res.data.comments[i].blog_id.postDate=this.$moment(this.$moment.utc(res.data.comments[i].blog_id.postDate).toDate()).format('YYYY-MM-DD HH:mm:ss')
                        res.data.comments[i].blog_id.lastPostDate=this.$moment(this.$moment.utc(res.data.comments[i].blog_id.lastPostDate).toDate()).format('YYYY-MM-DD HH:mm:ss')
                        }
                        this.comments=res.data.comments
                        if(this.total)this.empty=false
                        else this.empty=true
                    } else this.$message(res.data.message)
                },
                err=>{
                    this.$message("数据获取失败，请刷新重试~")
                }
            )
        }
    }

}
</script>

<style scoped>
    #mycomments{
        width:100%;
        position: relative;
    }

    #container{
        width:80%;
        margin:0 auto;
        position: relative;
    }
    
    #empty{
        text-align:center;
        margin:50px;
    }

    .toblog{
        width:98%;
        margin-left:1%;
        padding: 1%;
        background-color:floralwhite;
    }

    .date{
        color:grey;
        text-align: left;
        font-size:13px
    }

    .comment_content{
        background-color:honeydew;
    }

    .comment_container{
        padding:20px;
        border:grey solid 1px;
        position: relative;
    }

    #pagination{
        text-align:center;
        margin: 10px auto
    }
</style>
