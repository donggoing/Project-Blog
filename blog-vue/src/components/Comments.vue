<template>
    <div id="comments">
        <el-button @click="show_CBox=true">留言</el-button>
        <div class='comment' v-if="show_CBox">
            <el-input :rows="4" type="textarea" v-model="newcomment" class='newcomment' placeholder="写下你的留言抢下沙发吧~" >
            </el-input>
            <el-button @click="submitComment">提交</el-button>
            <el-button @click="show_CBox=false">收起</el-button>
        </div>
        <div v-if='empty===false'>
            <div v-for='(comment,index) in comments' :key='index'>
                <div class='comment_container'>
                    <p>{{comment.fromUser}}</p>
                    <p class="date">{{comment.cdateFN}} </p>
                    <div v-if="!comment.delete">
                        <p class="commentcontent">{{comment.content}}</p>
                        <el-button @click="comment.seeBox=true">回复</el-button>
                        <el-button v-if='$store.getters.username===comment.fromUser' @click="deleteComment(comment)">
                            删除
                        </el-button>
                    </div>
                    <div v-else class="delete">
                        <p>评论已被删除</p>
                    </div>
                    <!-- <input type="button" value="回复" @click="comment.seeBox=true"> -->
                    
                    <div class='commentReply' v-if="comment.seeBox">
                        <el-input type="textarea" :rows="4" v-model="comment.newreply" class='newreply' placeholder="写下回复的内容吧~" >
                        </el-input>
                        <el-button @click="submitR2C(comment)">提交</el-button>
                        <el-button @click="comment.seeBox=false">收起</el-button>
                    </div>
                </div>
                <div class="reply_container" v-for='(reply,index) in comment.replies' :style='calStyle(index)' :key='index'>
                    <p>{{reply.fromUser}}</p>
                    <p class="date">{{reply.rdateFN}} </p>
                    <p>To {{reply.toUser}}:</p>
                    <p v-if="!reply.delete">{{reply.content}}</p>
                    <div v-else class="delete">
                        <p>回复已被删除</p>
                    </div>
                    <!-- <input type="button" value="回复" @click="reply.seeBox=true"> -->
                    <el-button v-if="!reply.delete" @click="reply.seeBox=true">回复</el-button>
                    <el-button v-if='$store.getters.username===reply.fromUser&&!reply.delete' @click="deleteReply(reply)">
                        删除
                    </el-button>
                    <div v-if='reply.seeBox'>
                        <el-input type="textarea" :rows="4" class="newreply" v-model="reply.newreply" placeholder="写下回复的内容吧~"  >
                        </el-input>
                        <el-button @click="submitR2R(reply)">提交</el-button>
                        <el-button @click="reply.seeBox=false">收起</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p id='hint'>还没有评论，快来抢沙发吧~</p>
        </div>
    </div>
</template>

<script>
export default {
    name:'Comments',
    props:['blog_id'],
    data(){
        return {
            newcomment:'',
            comments:[],
            empty:false,
            show_CBox:false
        }
    },
    created(){
        this.init()
    },
    methods:{
        init(){
            this.$http.get('/api/getcomments/'+this.blog_id).then(
                res=>{
                    var comments=res.data.data
                    if(comments.length===0)
                        this.empty=true
                    else this.empty=false
                    comments=comments.map(comment=>{
                        comment.seeBox=false
                        comment.newreply=''
                        comment.replies=comment.replies.map(reply=>{
                            reply.seeBox=false
                            reply.newreply=''
                            return reply
                        })
                        return comment
                    })
                    this.comments=comments
                },
                err=>{
                    console.log(err)
                }
            )
        },
        //动态计算评论的宽度，返回样式
        calStyle(index){
            var constStyle="position:relative;min-width:450px;border-top:1px solid grey;border-left:1px solid grey;"
            var widthRate=Math.pow(0.95,index+1)*100
            return constStyle+"margin-left:"+(100-widthRate)+"%;width:"
            +widthRate+"%;padding-left:10px" 
        },

        submitR2C(comment){
            if(comment.newreply.match(/^ *$/))return this.$message('回复不允许为空~')
            this.$http.post('/api/reply/'+comment.blog_id+'/'+comment._id,
            {content:comment.newreply,
            blog_id:this.blog_id,
            comment_id:comment._id,
            to_comment:true,
            username:this.$store.getters.username,
            toUser:comment.fromUser}).then(
                res=>{
                    this.$message(res.data.message)
                    if(res.data.success){
                        comment.seeBox=false
                        comment.newreply=''
                    }
                    this.init()                    
                },
                err=>{
                    console.log(err)
                }
            )
        },
        submitR2R(reply){
            if(reply.newreply.match(/^ *$/))return this.$message('回复不允许为空~')
            this.$http.post('/api/reply/'+reply.blog_id+'/'+reply.comment_id,
            {content:reply.newreply,
            to_comment:false,
            reply_id:reply._id,
            username:this.$store.getters.username,
            toUser:reply.fromUser}).then(
                res=>{
                    this.$message(res.data.message)
                    if(res.data.success){
                        reply.seeBox=false
                        reply.newreply=''
                    }
                    this.init()                
                },
                err=>{
                    console.log(err)
                }
            )
        },
        submitComment(){
            if(this.newcomment.match(/^ *$/))return this.$message('评论不允许为空~')
            this.$http.post('/api/newcomment/'+this.blog_id,
            {content:this.newcomment,username:this.$store.getters.username}).then(
                res=>{
                    this.$message(res.data.message)
                    if(res.data.success){
                        this.empty=0;
                        this.show_CBox=false
                        this.newcomment=''
                    }
                    this.init()
                },
                err=>{
                    console.log(err)
                }
            )
        },
        deleteComment(comment){
            this.$http.post('/api/deleteComment',{
                username:this.$store.getters.username,
                comment_id:comment._id
            }).then(
                res=>{
                    this.$message(res.data.message)
                    this.init()
                },
                err=>{
                    console.log(err)
                }
            )
        },
        deleteReply(reply){
            this.$http.post('/api/deleteReply',{
                username:this.$store.getters.username,
                reply_id:reply._id
            }).then(
                res=>{
                    this.$message(res.data.message)
                    this.init()
                },
                err=>{
                    console.log(err)
                }
            )
        }
    }
 }
</script>

<style scoped>
    #comments{
        margin-bottom:40px
    }

    .comment_container{
        position: relative;
        min-width: 500px;
        border:1px solid grey;
        border-right:none;
        padding-left:10px;
        margin-bottom: 5px;
    }

    .reply_container{
        margin-bottom: 5px;
        border:1px solid grey;
        border-right:none;
    }

    .newcomment,.newreply{
        width:550px;
        height:120px;
        margin: 1px;
        vertical-align: top;
        resize:none
    }

    .delete{
        background-color: bisque;
    }

    .date{
        position: absolute;
        right:10px;
        top:0px;
        font-size: 15px;
        color:grey;
    }

    #hint{
        margin-top:40px
    }
</style>
