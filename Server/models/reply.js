var mongoose = require('mongoose')
var ObjectId=mongoose.Schema.Types.ObjectId

var ReplySchema = mongoose.Schema({
    // reply_id:{type: String, require: true},
    content:{type:String,require:true},
    to_comment:{type:Boolean,require:true,default:true},
    blog_id:{type:ObjectId,ref:"Blog"},
    comment_id:{type:ObjectId,ref:"Comment"},
    reply_id:{type:ObjectId,ref:"Reply"},
    fromUser:{type:String,require:true},
    toUser:{type:String,require:true},
    postDate: {type: Date, require: true,default:Date.now()},
    hidden: {type:Boolean, require:true,default:false},
    delete:{type:Boolean,require:true,default:false}
});

ReplySchema.index({_id:-1,rdate:-1,fromUser:1})


var Reply = mongoose.model("Reply", ReplySchema);
module.exports = Reply;