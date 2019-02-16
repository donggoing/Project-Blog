var mongodb = require('mongodb')
var mongoose = require('mongoose')
var bcrypt = require("bcrypt-nodejs")
var ObjectId=mongoose.Schema.Types.ObjectId

//哈希次数
var SALT_FACTOR = 10;
var userSchema = mongoose.Schema({
    username: { type: String, require: true, unique: true },
    tele:{type:String,require:true,unique:true},
    email:{type:String,require:true,unique:true},
    password: { type: String, require: true },
    role:{type:[String],require:true},
    blogs: {type:[{type:ObjectId,ref:"Blog"}],default:[]},
    comments: {type:[{type:ObjectId,ref:"Comment"}],default:[]},
    replies: {type:[{type:ObjectId,ref:"Reply"}],default:[]}
});

function noop(){}

//保存前加密存储
userSchema.pre("save", function(done) {
    var user = this;
    if (!user.isModified("password")) {
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) { 
            return done(err); 
        }
        
        bcrypt.hash(user.password, salt, noop, 
            function(err, hashedPassword) {
                if (err) {
                    return done(err); 
                }
                user.password = hashedPassword;
                done();
            }
        );
    });
});

userSchema.methods.checkPassword = function(guess, done) {
    bcrypt.compare(guess, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
}
var User=mongoose.model("User", userSchema);
module.exports=User