var express = require('express'),
    User=require('../models/user'),
    Blogs=require('../models/blog'),
    Reply=require('../models/reply'),
    Comment=require('../models/comment'),
    mongoose=require('mongoose')
    moment=require('moment')
    ObjectId=mongoose.Schema.Types.ObjectId

//该组api对已登录用户开放
module.exports=function(db){
    var api = express.Router();
    
    /**
     * 获取当前登录用户的所属用户组
     */
    api.get('/getinfo',(req,res)=>{
        if(req.session.role)return res.json({roles:req.session.role})
        else {
            return res.json({roles:null})
        }
    })
    
    /**
     * 检查登录状态
     */
    api.post('/checkstate',(req,res)=>{
        if(!req.session.role||!req.session.loginUser||req.session.loginUser!==req.body.username)
            res.json({isLogin:false})
        else{
            res.json({isLogin:true})
        }
    })

    /**
     * 创建新博客
     */
    api.post('/:user/newblog',(req,res)=>{
        var user = req.params.user
        if(user===req.session.loginUser){
            var now=Date.now()
            var title = req.body.title
            var newblog = req.body.newblog
            // var bindex = time + user
            var blog = new Blogs({
                // bindex : bindex,
                title : title,
                content : newblog,
                postUser : user,
                postDate : now,
                lastPostDate : now
            })
            blog.save((err,doc)=>{
                if(err){
                    res.json({message:"提交失败"})
                    return console.log(err)
                }
                else{
                    User.updateOne({username:user},{'$push': {blogs:doc}},(uperr)=>{
                        if(uperr) {
                            Blogs.findOneAndRemove({_id:doc._id}, function(removeerr, result){
                                if (removeerr) {
                                    console.log("Error:" + removeerr);
                                    res.json({success:0,message:"提交成功，但个人博客页面暂时不可见"})
                                }
                                else {
                                    console.log("Result:" + result);
                                    res.json({success:0,message:"提交失败,请重试~"})
                                }
                            })
                        }
                        else{
                            res.json({success:1,message:"提交成功！",blog_id:doc._id})
                        }
                    })
                }
            })
        }
    })

    /**
     * 更新博客
     */
    api.post('/:blog_id/updateblog',(req,res)=>{
        var blog_id=req.params.blog_id,
            newtitle=req.body.newtitle,
            newcontent=req.body.newcontent,
            askUser=req.body.user,
            now=Date.now()
        if(askUser===req.session.loginUser){
            Blogs.findOneAndUpdate({_id:blog_id,postUser:askUser},{title:newtitle,lastPostDate:now,content:newcontent}).then(
                blog=>{
                    res.json({success:1,message:"修改成功~"})
                },
                err=>{
                    console.log(err)
                    res.json({success:0,message:"修改失败，请重试后联系后台~"})
                }
            )
        }
        else{
            res.json({success:0,message:'请检查登录状态'})
        }
    })

    /**
     * 创建新评论
     */
    api.post('/newcomment/:blog_id',(req,res)=>{
        var content=req.body.content,
            blog_id=req.params.blog_id,
            now=Date.now(),
            loginUser=req.session.loginUser,
            askUser=req.body.username
            newcomment=new Comment({
                content:content,
                blog_id:blog_id,
                replies:[],
                fromUser:askUser,
                postDate:now
            })
            if(askUser==loginUser){
              newcomment.save((err,comment)=>{
                  if(err){
                    res.json({success:0,message:"评论提交失败，请重试~"})
                  }else{
                    Blogs.updateOne({_id:blog_id},{'$push':{comments:{_id:comment._id}}},{},(uperr)=>{
                        if(uperr){
                            console.log(uperr)
                            Comment.findByIdAndRemove(comment_id,(removeerr)=>{
                                if(removeerr){
                                    console.log(removeerr)
                                    res.json({success:0,message:"评论已已提交，但博客界面尚不可见，等待后台修复~"})
                                }else{
                                    res.json({success:0,message:"评论提交失败，请重试~"})
                                }
                            })
                        }else{
                            User.updateOne({username:askUser},{'$push':{comments:{_id:comment._id}}},{},
                            (usererr)=>{
                                if(usererr){
                                    console.log(usererr)
                                    res.json({success:1,message:"提交成功，但在个人页面尚不可见,等待后台修复~"})
                                }else{
                                    res.json({success:1,message:"提交成功！"})
                                }
                            }) 
                        }
                    })
                }
            })
        }else{
            res.json({success:0,message:"请检查登录状态"})
        }
    })

    /**
     * 回复评论 或 对评论下的回复进行回复
     */
    api.post('/reply/:blog_id/:comment_id',(req,res)=>{
        var content=req.body.content,
        comment_id=req.params.comment_id,
        blog_id=req.params.blog_id,
        reply_id=req.body.reply_id,
        to_comment=req.body.to_comment,
        now=Date.now(),
        loginUser=req.session.loginUser,
        fromUser=req.body.username,
        toUser=req.body.toUser,
        now=Date.now()

        if(to_comment){
            Comment.findById(comment_id).exec(
                (err,comment)=>{
                    if(err||!comment){
                        res.json({success:0,message:"回复失败~请联系工作人员"})
                        if(err)console.log(err)
                    }else{
                        if(comment.delete)return res.json({success:0,message:"评论已被删除，不可评论"})
                    }
                }
            )
        }else{
            Reply.findById(reply_id).exec(
                (err,reply)=>{
                    if(err||!reply){
                        res.json({success:0,message:"回复失败~请联系工作人员"})
                        if(err)console.log(err)
                    }else{
                        if(reply.delete)return res.json({success:0,message:"评论已被删除，不可评论"})
                    }
                }
            )
        }
        var reply={
            content:content,
            blog_id:blog_id,
            comment_id:comment_id,
            reply_id:reply_id,
            fromUser:fromUser,
            toUser:toUser,
            postDate:now
        }
        if(!to_comment)reply.reply_id=req.body.reply_id
        var newreply=new Reply(reply)
        if(fromUser==loginUser){
            newreply.save((err,reply)=>{
                if(err){
                    res.json({success:0,message:"回复提交失败，请重试~"})
                }else{
                    Comment.findByIdAndUpdate(comment_id,{'$push':{replies:{_id:reply._id}}},(uperr)=>{
                        if(uperr){
                            console.log(uperr)
                            Reply.findByIdAndRemove(reply._id,(removeerr)=>{
                                if(removeerr){
                                    console.log(removeerr)
                                    res.json({success:0,message:"回复已提交，但博客界面尚不可见，等待后台修复~"})
                                }else{
                                    res.json({success:0,message:"回复提交失败，请重试~"})
                                }
                            })
                        }else{
                            User.findOneAndUpdate({username:fromUser},{'$push':{replies:{_id:reply._id}}},
                            (usererr)=>{
                                if(usererr){
                                    console.log(usererr)
                                    res.json({success:1,message:"提交成功，但在个人页面尚不可见,等待后台修复~"})
                                }else{
                                    res.json({success:1,message:"提交成功！"})
                                }
                            }) 
                        }
                    })
                }
            })
        }else{
            res.json({success:0,message:"请检查登录状态"})
        }
    })
   
    /**
     * 获取当前用户对博客的评论或回复
     * 实现数据分页传输
     */
    api.post('/getcomments',(req,res)=>{
        var user=req.session.loginUser,
            page=req.body.page,
            pageSize=req.body.limit
        User.findOne({username:user}).populate(
            {path:'comments',populate:{path:'blog_id'
            ,select:"title postUser postDate lastPostDate hidden"}}
        ).populate({path:'replies',populate:{path:'blog_id'
            ,select:"title postUser postDate lastPostDate hidden"}}
        ).exec(
            (err,result)=>{
                if(err){
                    console.log(err)
                    res.json({success:0,message:"获取失败~"})
                } else {
                    comments=[...result.comments,...result.replies]
                    res.json({success:1,
                        comments:comments.slice((page-1)*pageSize,page*pageSize),
                        count:comments.length})
                }
            }
        )
    })


    /**
     * 获取当前用户发表的博客，包括被管理员隐藏的（不包括content）
     * 实现数据分页传输
     */
    api.post('/:user/getblogs',function(req,res){
        var user=req.params.user,
            page=req.body.page,
            pageSize=req.body.limit

        User.findOne({username:user}).populate({path:'blogs',
        select:'title lastPostDate postUser postDate hidden _id',
        options:{sort:{'lastPostDate':-1}}}
        )
        .exec((err,result)=>{
            if(err)res.json({success:0,message:"服务器错误，请稍后再试~"})
            else{
                var blogs=result.blogs
                res.json({success:1,blogs:blogs.slice((page-1)*pageSize,page*pageSize),count:blogs.length})
            }
        })   
    })

    /**
     * 获取所有未被隐藏的博客（不包括content）
     * 实现数据分页传输
     */
    api.post('/getallblogs',(req,res)=>{
        var page=req.body.page
        var pageSize=req.body.limit
        if((page>0)&&(pageSize>0)){
            Blogs.find({hidden:false},{},{select:'title postDate lastPostDate postUser hidden _id'
            ,sort:{'lastPostDate':-1}})
            .exec(
                (blogerr,blogs)=>{
                    if(blogerr){
                        console.log(blogerr)
                        res.json({success:0,message:'博客获取失败，请检查~'})
                    }else{
                        res.json({success:1,blogs:blogs.slice((page-1)*pageSize,page*pageSize),count:blogs.length})
                    }
                }
            )
        }
    })

    /**
     * 获取blog_id对应博客的全部信息
     */
    api.get('/getblog/:blog_id',(req,res)=>{
        var blog_id=req.params.blog_id
        Blogs.findById(blog_id,(err,blog)=>{
            if(err)return res.json({success:0,message:"博客获取异常"})
            else{
                return res.json({success:1,message:"成功获取~",data:blog})
            }
        })
    })
    
    /**
     * 搜索api
     * 根据queryType决定查询document
     * 不包括被管理员隐藏的
     * 也不包括博客的content
     * 实现数据分页传输
     */
    api.post('/search',(req,res)=>{
        var queryType=req.body.type,
            queryVal=req.body.val,
            page=req.body.page,
            pageSize=req.body.limit,
            queryJson={}
        if(queryType===0){
            queryJson.postUser=queryVal
            queryJson.hidden=false
        } else if(queryType===1) {
            queryJson.title={$regex:queryVal,$options: 'i'}
        } else if(queryType===2){
            queryJson.postUser=req.session.loginUser
            queryJson.title={$regex:queryVal,$options: 'i'}
        }else queryJson={hidden:false}
        Blogs.find(queryJson,{},{select:'title postDate postUser lastPostDate hidden _id',sort:{'lastPostDate':-1}}).exec(
            (blogerr,blogs)=>{
                if(blogerr){
                    console.log(blogerr)
                    res.json({success:0,message:'博客获取失败，请检查~'})
                }else{
                    res.json({success:1,blogs:blogs.slice((page-1)*pageSize,page*pageSize),count:blogs.length})
                }
            }
        )
    })

    /**
     * 获取当前博客下的评论（包括评论下的回复）
     */
    api.get('/getcomments/:blog_id',(req,res)=>{
        var blog_id=req.params.blog_id
        Blogs.findById(blog_id).populate({path:'comments',
        populate:{
            path:"replies",
        }})
        .exec((err,blog)=>{
            if(err){
                res.json({success:0,message:"服务器错误，请稍后再试~"})
            }else{
                var comments=blog.comments
                for(var i=0;i<comments.length;i++){
                    comments[i]=comments[i].toJSON()
                    if(comments[i].hidden)
                        delete comments[i].content
                    comments[i].postDateFN=fromNow(comments[i].postDate)
                    var replies=comments[i].replies
                    for(var j=0;j<replies.length;j++){
                        if(replies[j].hidden)
                            delete replies[j].content
                        replies[j].postDateFN=fromNow(replies[j].postDate)
                    }
                    comments[i].replies=replies
                }
            }res.json({success:1,data:comments})
        })
    })


    /**
     * 删除博客,连带删除评论和回复
     */
    api.post('/deleteblog',(req,res)=>{
        var blog_id=req.body.blog_id
        var askUser=req.body.username
        var loginUser=req.session.loginUser
        if(askUser===loginUser){
            Blogs.findOne({_id:blog_id,postUser:loginUser}).populate({path:'comments',
            populate:{path:"replies"}}).exec((finderr,blog)=>{
                if(finderr){
                    res.json({success:0,message:"服务器开小差了~请稍后再试~"})
                }
                else{
                    if(!blog){
                        res.json({success:0,message:"请检查登陆用户状态~"})
                    }else{
                        try{
                            Blogs.findByIdAndRemove(blog_id).exec()
                            User.updateOne({username:askUser},{$pull:{blogs:blog_id}}).exec()
                            for(var i=0;i<blog.comments.length;i++){
                                for(var j=0;j<blog.comments[i].replies.length;j++){
                                    User.updateOne({username:blog.comments[i].replies[j].fromUser},
                                        {$pull:{replies:blog.comments[i].replies[j]._id}}).exec()
                                    Reply.findByIdAndRemove(blog.comments[i].replies[j]._id).exec()
                                }
                                User.updateOne({username:blog.comments[i].fromUser},
                                    {$pull:{comments:blog.comments[i]._id}}).exec()
                                Comment.findByIdAndRemove(blog.comments[i]._id).exec() 
                            }
                            res.json({success:1,message:"已成功删除博客~"})
                        }
                        catch(err){
                            console.log(err)
                            res.json({success:0,message:"状态异常,请检查是否已删除~"})
                        }
                    }
                }
            }) 
        }else{
            res.json({success:0,message:'删除失败，请检查登陆状态'})
        }
    })

    /**
     * 删除评论，清空content，标记delete
     * 去除user的评论记录
     */
    api.post('/deleteComment',(req,res)=>{
        var user=req.body.username
        var comment_id=req.body.comment_id
        if(user===req.session.loginUser){
            Comment.findById(comment_id).exec(
            (err,comment)=>{
                if(err){
                    console.log(err)
                    res.json({success:0,message:"查找不到评论,删除失败,请与后台人员反应~"})
                }else{  
                    if(comment.fromUser===user){
                        try{
                            comment.delete=true
                            comment.content=""
                            comment.save()
                            User.updateOne({username:user},{$pull:{comments:comment_id}}).exec()
                            res.json({success:1,message:"删除成功"})
                        }
                        catch(e){
                            console.log(e)
                            res.json({success:0,message:"删除失败,请与后台人员反应~"})
                        }
                    }
                }
            })
        }else{
            res.json({success:0,message:"请检查登录状态"})
        }
    })

    /**
     * 删除回复，清空content，标记delete
     * 去除user的回复记录
     */
    api.post('/deleteReply',(req,res)=>{
        var user=req.body.username
        var reply_id=req.body.reply_id
        if(user===req.session.loginUser){
            Reply.findById(reply_id).exec(
            (err,reply)=>{
                if(err){
                    console.log(err)
                    res.json({success:0,message:"查找不到回复,删除失败,请与后台人员反应~"})
                }else{  
                    if(reply.fromUser===user){
                        try{
                            reply.delete=true
                            reply.content=""
                            reply.save()    
                            User.updateOne({username:user},{$pull:{replies:reply_id}}).exec()
                            res.json({success:1,message:"删除成功"})
                        }
                        catch(e){
                            console.log(e)
                            res.json({success:0,message:"删除失败,请与后台人员反应~"})
                        }
                    }
                }
            })
        }else{
            res.json({success:0,message:"请检查登录状态"})
        }
    })

    return api 
}

utc8=function(date){
    return moment(date).utc(8).format()
}

fromNow=function(date){
    return this.moment(utc8(date),'YYYY-MM-DD HH:mm:ss').fromNow()                        
}