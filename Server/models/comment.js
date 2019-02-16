var mongoose = require('mongoose');
var ObjectId=mongoose.Schema.Types.ObjectId

var CommentSchema = mongoose.Schema({
    // comment_id:{type: String, require: true},
    content:{type:String,require:true},
    blog_id:{type:ObjectId,ref:"Blog",require:true},
    replies:{type:[{type:ObjectId,ref:"Reply"}],default:[]},
    fromUser:{type:String,require:true},
    postDate: { type: Date, require: true,default:Date.now()},
    hidden: {type:Boolean, require:true,default:false},
    delete:{type:Boolean,require:true,default:false}
});

CommentSchema.index({_id:-1,cdate:-1,fromUser:1})


var Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;

/**
 * 
     ,function(usererr,userres){
                if(usererr)return res.json(500,"服务器错误，请稍后再试")
                else{
                    userres.populate()

                    var blogindexs=userres.blogs
                    var blogindexs=[...blogindexs].map(function(v){return v.blogindex})
                    Blogs.find({_id:{"$in":blogindexs}},function(blogerr,blogres){
                        if(blogerr)return res.status(500).end
                        else{
                            if(blogres.hidden)blogres.blog=""
                            var blogres=blogres.map(blog=>{
                                return {
                                    bindex : blog.bindex,
                                    title : blog.title,
                                    content : blog.content,
                                    postUser : blog.postUser,
                                    postData : blog.postData
                                }
                            })
                            res.json(blogres)
                        }
                    })
                }
 */