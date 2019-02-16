<template>
    <div id="allblogs">
        <Menu></Menu>
        <div id="container">
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
                <el-button @click="Search">查询</el-button>
                <el-button v-if="searching" @click="getblogs">还原</el-button> 
            </div>
            <div id='refresh'>
                <img src='@/assets/images/refresh.png' @click="getblogs"/>
                <p id="refreshTime">刷新时间：{{refreshTime}}</p>
            </div>
            <div id="blogs" v-if="!empty">
                <div class="blog" v-for="blog in blogs" :key="blog._id"  >
                    <div v-if="!blog.hidden">
                        <h2><a href="" @click="toBlog(blog)">{{blog.title}}</a>
                        </h2>
                            <p id="bloger">博主：{{blog.postUser}}</p>
                            <p class="date">首次提交时间：{{blog.postDate}}</p>
                            <p class="date">最新提交时间：{{blog.lastPostDate}}</p>
                        <p class="left">{{blog.content}}</p>
                    </div>
                    <div v-else>
                        <p class="beHidden">博客已被管理员隐藏.</p>
                    </div>
                </div>
            </div>
            <div id="hint" v-else>
                <p >当前页无博客</p>
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
            queryVal:"",
        }
    }
    ,
    components:{Menu},
    mounted() {
        this.getblogs()
    }
    ,
    watch:{
        'currentPage':'getdata'
    },
    methods: {
        getdata(){
            if(this.searching)this.doSearch()
            else this.getblogs()
        },
        getblogs(){
            this.searching=0
            this.refreshTime=this.$moment(Date.now()).format('HH:mm:ss')
            this.$http.post('http://localhost:3000/api/getallblogs',{
                page: this.currentPage,limit:this.pageSize
            }).then(
            res=>{
                if(res.data.success){
                    console.log(res.data)
                    this.total=res.data.count
                    for(var i=0;i<res.data.blogs.length;i++){
                        res.data.blogs[i].postDate=this.$moment(this.$moment
                        .utc(res.data.blogs[i].postDate).toDate())
                        .format('YYYY-MM-DD HH:mm:ss')
                        res.data.blogs[i].lastPostDate=this.$moment(this.$moment
                        .utc(res.data.blogs[i].lastPostDate).toDate())
                        .format('YYYY-MM-DD HH:mm:ss')
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
                this.$http.post('http://localhost:3000/api/search',{
                val:queryVal,
                type:queryType,
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
        current_change:function(currentPage){
            this.currentPage = currentPage;
        },
        refresh(){
            this.getdata()
        },
        toBlog(blog){
            this.$router.push({path:"/blog",query:{blog_id:blog._id}})
        }
    }
}
</script>

<style scoped>
    h2{
        font-size:35px;
        text-align:left
    }

    #container{
        width:80%;
        margin:0 auto 80px;
        position: relative;
    }

    #blogs{
        background-color: rgba(255, 255, 255, .75)
    }

    #search{
        margin:10px;
        /* margin-bottom:10px */
    }

    #allblogs{
        position: relative;
        text-align: left;
    }

    .left{
        text-align:left;
    }

    .blog{
        border:1px grey solid;
        padding:10px;
    }

    .date{
        color:grey;
        text-align: left;
        font-size:13px
    }
    
    #hint{
        height:50px;
        margin:20px;
        text-align:center
    }

    #refresh{
        color:grey;
        /* display: inline; */
        position: absolute;
        right:20px;
        top:8px;
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
        text-align: center
    }

</style>
