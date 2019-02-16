var express = require('express'),
    User=require('../models/user'),
    Blogs=require('../models/blog'),
    Reply=require('../models/reply'),
    Comment=require('../models/comment'),
    mongoose=require('mongoose'),
    moment=require('moment'),
    ObjectId=mongoose.Schema.Types.ObjectId


//该组api对admin管理员开放

module.exports = function(db){
    var api=express.Router()
    /**
     * 获取全部blog，包括被隐藏的
     */
    api.post('/getallblogs',(req,res)=>{
        var page=req.body.page,
            pageSize=req.body.limit
        Blogs.countDocuments({},(err,count)=>{
            if(err){
                console.log(err)
                res.json({success:0,message:'博客获取失败，请检查~'})
            }else{
                if((page>0)&&(pageSize>0)&&(page*pageSize>count)){
                    Blogs.find({},{},{select:'title postDate postUser lastPostDate hidden _id',sort:{'lastPostDate':-1}}).skip((page-1)*pageSize).limit(pageSize).exec(
                        (blogerr,blogs)=>{
                            if(blogerr){
                                console.log(blogerr)
                                res.json({success:0,message:'博客获取失败，请检查~'})
                            }else{
                                res.json({success:1,blogs:blogs,count:count})
                            }
                        }
                    )
                }
            }
        })
    })

    /**
     * 隐藏或显示blog
     * 传入当前隐藏或显示状态
     */
    api.post('/toggleblog',(req,res)=>{
        var blog_id=req.body.blog_id
        var state=req.body.state
        if(!req.session.role||req.session.role.indexOf('admin')!==-1){
            Blogs.findByIdAndUpdate(blog_id,{hidden:!state},(err,result)=>{
                if(err){
                    console.log(err)
                    res.json({success:0,message:"操作失败，请检查后台服务器~"})
                }else{
                    res.json({success:1,message:"操作成功~"})
                }
            })
        }else{
            res.json({success:0,message:"操作失败，请检查账号权限"})
        }
    })

    /**
     * 隐藏或显示comment
     * 传入当前隐藏或显示状态
     */
    api.post('/togglecomment',(req,res)=>{
        var comment_id=req.body.comment_id
        var state=req.body.state
        if(!req.session.role||req.session.role.indexOf('admin')!==-1){
            Comment.findByIdAndUpdate(comment_id,{hidden:!state},(err,result)=>{
                if(err){
                    console.log(err)
                    res.json({success:0,message:"操作失败，请检查后台服务器~"})
                }else{
                    res.json({success:1,message:"操作成功~"})
                }
            })
        }else{
            res.json({success:0,message:"操作失败，请检查账号权限"})
        }
    })

    /**
     * 隐藏或显示reply
     * 传入当前隐藏或显示状态
     */
    api.post('/togglereply',(req,res)=>{
        var reply_id=req.body.reply_id
        var state=req.body.state
        if(!req.session.role||req.session.role.indexOf('admin')!==-1){
            Reply.findByIdAndUpdate(reply_id,{hidden:!state},(err,result)=>{
                if(err){
                    console.log(err)
                    res.json({success:0,message:"操作失败，请检查后台服务器~"})
                }else{
                    res.json({success:1,message:"操作成功~"})
                }
            })
        }else{
            res.json({success:0,message:"操作失败，请检查账号权限"})
        }
    })


    /**
     * 搜索api
     * 根据queryType决定查询document
     * 检查是否具有admin权限，若不具有则要求检查权限
     */
    api.post('/search',(req,res)=>{
        if(!req.session.role||req.session.role.indexOf('admin')!==-1){
            var queryType=req.body.type,
                queryVal=req.body.val,
                page=req.body.page,
                pageSize=req.body.limit,
                queryJson
            if(queryType===0){
                queryJson={postUser:queryVal}
            } else {
                queryJson = {
                        title:{$regex:queryVal,$options: 'i'}
                    }
            }
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
        } else{
            res.json({success:0,message:"查找失败，请检查账号权限"})
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