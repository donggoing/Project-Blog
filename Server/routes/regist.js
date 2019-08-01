var express = require('express');
var User = require('../models/user');
var func = require('../public/javascripts/forRegist');

module.exports = function(db) {

    var router = express.Router();
    /**
     * 注册用户
     */
    router.post('/', function(req, res) {

        var user = req.body.user;
        var email = req.body.email;
        var tele = req.body.tele;
        var pw = req.body.password;
        var rcpw = req.body.rcpassword;

        var warn = func.checkAll(user, tele, email, pw, rcpw);
        //信息无非法错误时尝试注册，否则返回错误信息
        if (!warn.warn) {
            User.find({ $or: [{ username: user }, { tele: tele }, { email: email }] }, function(findErr, findRes) {
                //查找失败=>注册失败
                if (findErr) {
                    console.log(findErr)
                        //warn.warn=-1=>注册失败
                    warn.warn = -1
                } else {
                    //查无重复项=>进行注册
                    var now = Date.now()
                    if (findRes.length === 0) {
                        var newUser = new User({
                            username: user,
                            password: pw,
                            tele: tele,
                            email: email,
                            role: ["bloger"],
                            regist_date: now,
                            blogs: [],
                            comments: [],
                            replies: []
                        });
                        newUser.save((registErr, registUser) => {
                            //入库失败
                            if (registErr) {
                                warn.warn = -1
                                console.log(registErr)
                                return res.json(warn)
                            } else {
                                //成功注册入库
                                req.session.loginUser = user
                                req.session._id = registUser._id
                                req.session.role = registUser.role
                                console.log(req.session);
                            }
                        });
                    } else {
                        //查出重复项=>修改返回前端的信息标识
                        warn.same = 1;
                        for (var i = 0; i < findRes.length; i++) {
                            if (findRes[i].username === user) { warn.user = 1 }
                            if (findRes[i].tele === tele) { warn.tele = 1 }
                            if (findRes[i].email === email) { warn.email = 1 }
                        }
                    }
                }
                res.json(warn);
            })
        } else res.json(warn);
    });
    return router
}