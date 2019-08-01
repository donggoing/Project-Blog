<template>
    <div id="myblogs">
        <div id="search">
            <el-input style="margin-left:0;width:200px" 
                type="text"
                v-model="queryVal"
                placeholder="请输入查询标题内容"
                @keyup.enter.native="Search">
                </el-input>
                <el-button style="margin-left:0" @click="Search">查询</el-button>
                <el-button v-if="searching" @click="getblogs">还原</el-button>
        </div>
        <div id='refresh'>
            <img src='@/assets/images/refresh.png' @click="refresh"/>
            <p id="refreshTime">刷新时间：{{refreshTime}}</p>
        </div>

        <div id="blogs" v-if="!empty">
            <div class="blog" v-for="blog in blogs" :key="blog._id"  >
                    <h2><a href="" @click="toBlog(blog)">{{blog.title}}</a>
                    </h2>
                    <p class="date">首次提交时间：{{blog.postDate}}</p>
                    <p class="date">最新提交时间：{{blog.lastPostDate}}</p>
                    <hr>
                    <div v-if="blog.hidden" class="beHidden">
                        <p>请注意，该博客已被管理员隐藏.</p>
                    </div>
                    <el-button @click="modify(blog._id)">修改</el-button>
                    <el-button @click="deleteblog(blog._id)">删除</el-button>
            </div>
        </div>
        <div v-else id="newblog">
            <router-link :to="{path:'newblog'}">无博客，发一篇博客吧~</router-link>
        </div>

        <el-pagination id="pagination" class="fy"
            layout="total, prev, pager, next, jumper"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="current_change"
            :total="total"
            background
            >
        </el-pagination>
        <footer></footer>
    </div>
</template>

<script>

export default {
    data(){
        return{
            total:0,
            pageSize:5,
            currentPage:1,
            blogs:[],
            searching:false,
            empty:true,
            refreshTime:null,
            queryVal:"",
        }
    }
    ,
    mounted() {
        this.getblogs()
    },
    watch:{
        'currentPage':'getdata'
    }
    ,
    methods: {
        getdata(){
            if(this.searching)this.doSearch()
            else this.getblogs()
        },
        getblogs(){
            this.refreshTime=this.$moment(Date.now()).format('HH:mm:ss')
            this.$http.post('/api/'+this.$store.getters.username+'/getblogs',{
                page: this.currentPage,limit:this.pageSize
            }).then(
            res=>{
                if(res.data.success){
                    console.log(res.data)
                    this.total=res.data.count
                    for(var i=0;i<res.data.blogs.length;i++){
                        res.data.blogs[i].postDate=this.$moment(this.$moment.utc(res.data.blogs[i].postDate).toDate()).format('YYYY-MM-DD HH:mm:ss')
                        res.data.blogs[i].lastPostDate=this.$moment(this.$moment.utc(res.data.blogs[i].lastPostDate).toDate()).format('YYYY-MM-DD HH:mm:ss')
                    }
                    this.blogs=res.data.blogs
                    this.empty=(this.blogs.length===0)
                }
                else{
                    this.$message(res.data.message)
                }
            },
            err=>{
                console.log(err)
                this.$message(err)
            }
        )},
        Search(){
            if(this.queryVal.match(/^ *$/))
                return this.$message("请输入查询内容~")
            this.searching=1
            this.currentPage=1
            this.doSearch()
        },
        doSearch(){
            var queryType=this.queryType, 
                queryVal=this.queryVal
            this.$http.post('/api/search',{
                type:2,
                val:queryVal,
                page:this.currentPage,
                limit:this.pageSize
            }).then(
                res=>{
                    if(res.data.success){
                        console.log(res.data)
                        this.total=res.data.count
                        for(var i=0;i<res.data.blogs.length;i++){
                            res.data.blogs[i].postDate=this.$moment(this.$moment.utc(res.data.blogs[i].postDate).toDate()).format('YYYY-MM-DD HH:mm:ss')
                            res.data.blogs[i].lastPostDate=this.$moment(this.$moment.utc(res.data.blogs[i].lastPostDate).toDate()).format('YYYY-MM-DD HH:mm:ss')
                        }
                        this.blogs=res.data.blogs
                        if(this.blogs.length>0)this.empty=false
                        else this.empty=true
                    }
                    else{
                        this.$message(res.data.message)
                    }
                },
                err=>{
                    console.log(err)
                    this.$message("失败~请重试~")
                }
            )
        },
        current_change:function(currentPage){
            this.currentPage = currentPage;
        },
        toBlog(blog){
            this.$router.push({path:"/blog",query:{blog_id:blog._id}})
        },
        refresh(){
            this.getdata()
        },
        modify(id){
            this.$router.push({path:'/editblog',query:{blog_id:id}})
        },
        deleteblog(id){
            this.$http.post('/api/deleteblog',{blog_id:id,username:this.$store.getters.username}).then(
                res=>{
                    this.$message(res.data.message)
                    this.refresh()
                },
                err=>{
                    console.log(err)
                    this.$message("状态异常,请重新~")
                }
            )
        }
    }
}
</script>

<style scoped>
    #myblogs{
        /* width:80%; */
        margin:0 auto 80px;
        text-align: left;
        position: relative;
    }

    h2{
        font-size:35px;
        margin: 10px;
        font-size:30px;
        margin-top:10px;
    }

    #beHidden{
        border:1px solid grey;
        width:100%;
    }

    .left{
        text-align:left;
    }

    #search{
        margin-bottom: 10px
    }

    .blog{
        border:1px grey solid;
        padding:10px
    }

    #blogs{
        background-color: rgba(255, 255, 255, .75);
    }

    .date{
        color:grey;
        text-align: left;
        font-size:15px;
    }

    #newblog{
        height:50px;
        margin:20px;
        text-align:center;
    }

    #refresh{
        color:grey;
        /* display: inline; */
        position: absolute;
        right:20px;
        top:5px;
        font-size:15px;
    }

    #refreshTime{
        display: inline;
        /* vertical-align: text-bottom; */
    }

    #refresh img{
        margin-top:10px;
        width:20px;
        height: 20px;
        vertical-align:text-bottom
    }

    #pagination{
        text-align: center;
    }

</style>
