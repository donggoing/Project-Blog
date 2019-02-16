var mongoose = require('mongoose');
var ObjectId=mongoose.Schema.Types.ObjectId

var BlogSchema = mongoose.Schema({
    // blog_id:{type: String, require: true},
    title: {type: String, require: true}, 
    content:{type:String,require:true},
    postUser:{type:String,require:true},
    postDate: { type: Date, require: true,default:Date.now()},
    lastPostDate: {type: Date, require: true,default:Date.now()},
    hidden: {type:Boolean, require:true,default:false},
    comments: {type:[{type:ObjectId,ref:"Comment"}],default:[]}
});

BlogSchema.index({_id:-1,postUser:1,lastPostDate:-1})


var Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;

