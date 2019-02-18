<template>
    <div id="container">
        <Menu></Menu>
        <div id="manageblogs">
            <div id="search">
                <el-select style="float:left" id="searchWay" value-key="name" placeholder="请选择查询方式" v-model="queryType">
                    <el-option 
                        v-for="item in meta" 
                        :key="item.id" 
                        :value="item.id" 
                        :label="item.tag">
                    </el-option>
                </el-select>
                <el-input style="float:left;width:200px" 
                type="text"
                v-model="queryVal"
                placeholder="请输入查询内容"
                @keyup.enter.native="Search">
                </el-input>
                <el-button id="searchbutton" type="primary" icon="el-icon-search" @click="Search">查询</el-button>
                <el-button v-if="searching" @click="getblogs">还原</el-button> 
            </div>
            <div id='refresh'>
                <img src='@/assets/images/refresh.png' @click="getblogs"/>
                <p id="refreshTime">刷新时间：{{refreshTime}}</p>
            </div>
            <div id="blogs" v-if="!empty">
                <div class="blog" v-for="blog in blogs" :key="blog._id"  >
                    <h2><a href="" class="title" @click="toBlog(blog)">{{blog.title}}</a>
                    </h2>
                        <p class="data">博主：{{blog.postUser}}</p>
                        <p class="date">首次提交时间：{{blog.postDate}}</p>
                        <p class="date">最新提交时间：{{blog.lastPostDate}}</p>
                    <hr>
                    <div v-if="blog.hidden">
                        <p class="beHidden">博客已被管理员隐藏.</p>
                        <el-button class="green" @click="Toggle(blog)">恢复</el-button>
                    </div>
                    <el-button v-else @click="Toggle(blog)">隐藏</el-button>
                    
                </div>
            </div>
            <div v-else>
                <p id='empty'>当前页无博客</p>
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
        </div>
    </div>    
</template>

<script>
import Menu from '@/components/NavMenu'
export default {
    name: "manageblogs",
    data(){
        return{
            total:0,
            pageSize:5,
            currentPage:1,
            blogs:[],
            searching:false,
            empty:true,
            refreshTime:null,
            meta:[
                {id:0,tag:'按用户名查询'},
                {id:1,tag:'按标题查询'}
            ],
            queryType:0,
            queryVal:""
        }
    }
    ,
    components:{Menu},
    mounted() {
        this.getblogs()
    },
    watch:{
        'currentPage':'getdata'
    }
    ,
    methods: {
        //页数改变时根据当前是否在执行查找选择对应的请求函数
        getdata(){
            if(this.searching)this.doSearch()
            else this.getblogs()
        },
        getblogs(){
            this.searching=0
            this.refreshTime=this.$moment(Date.now()).format('HH:mm:ss')
            this.$http.post('/api/A/getallblogs',{
                page: this.currentPage,limit:this.pageSize
            }).then(
            res=>{
                if(res.data.success){
                    // console.log(res.data)
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
            this.$http.post('/api/A/search',{
                val:queryVal,
                type:queryType,
                page:this.currentPage,
                limit:this.pageSize
            }).then(
                res=>{
                    if(res.data.success){
                        // console.log(res.data)
                        this.total=res.data.count
                        for(var i=0;i<res.data.blogs.length;i++){
                            res.data.blogs[i].postDate=this.$moment(this.$moment.utc(res.data.blogs[i].postDate).toDate()).format('YYYY-MM-DD HH:mm:ss')
                            res.data.blogs[i].lastPostDate=this.$moment(this.$moment.utc(res.data.blogs[i].lastPostDate).toDate()).format('YYYY-MM-DD HH:mm:ss')
                        }
                        this.blogs=res.data.blogs
                        if(this.blogs.length>0)this.empty=false
                        else this.empty=true
                        // this.currentQueryVal=this.queryVal
                        // this.key()
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
        toBlog(blog){
            this.$router.push({path:"/manageablog",query:{blog_id:blog._id}})
        },
        current_change:function(currentPage){
            this.currentPage = currentPage;
        },
        Toggle(blog){
            this.$http.post('/api/A/toggleblog',
            {blog_id:blog._id,state:blog.hidden}).then(
                res=>{
                    this.$message(res.data.message)
                        if(res.data.success)blog.hidden=!blog.hidden
                },
                err=>{
                    console.log(err)
                    this.$message("失败~请重试~")
                }
            )
        }
        // },
        // key(){
        //     var ym=document.getElementsByClassName('title').innerHTML;
        //     document.getElementsByClassName('title').innerHTML=ym.replace(this.currentQueryVal, "<span class='keyword'>"+this.currentQueryVal+"</span>");
        // }
        
    }
}
</script>

<style scoped>
    h2{
        font-size:35px;
        text-align:left
    }

    #container{
        width:100%;
        margin:0 auto 80px;
        position: relative;
        text-align: left
    }

    #manageblogs{
        width:80%;
        margin:0 auto;
        position: relative;
    }

    #return{
        margin:10px;
    }

    #pagination{
        text-align: center;
    }

    #search{
        margin-bottom: 10px
    }

    #empty{
        text-align:center;
        margin:50px;
    }

    .blog{
        border:1px grey solid;
        padding: 8px;
    }

    #blogs{
        background-color: rgba(255, 255, 255, .75)
    }

    .date{
        color:grey;
        text-align: left;
        font-size:12px
    }

    #searchbutton{
        margin-left:5px;
    }

    #refresh{
        color:grey;
        /* display: inline; */
        position: absolute;
        right:20px;
        top:10px;
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

</style>
