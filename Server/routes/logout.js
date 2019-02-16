var express=require('express');
var router=express.Router();

/**
 * 退出当前用户
 * 删除session的loginUser和role
 */
router.get('/', function(req, res){ 
    try{
        delete req.session.loginUser
        delete req.session.role
        res.json({success:1})
    }
    catch(err){
        console.log(err)
        res.json({success:0})
    }

});

module.exports=router;