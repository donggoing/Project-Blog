var express = require('express');
var User = require('../models/user');
var router = express.Router();
var path = require('path');

module.exports = function(db) {
    router.get('/', function(req, res, next) {
        res.sendFile(path.resolve(__dirname, '../public/index.html'));
    })

    /**
     * 登录
     * 若登录成功，在session中保存role和loginUser
     */
    router.post('/', function(req, res) {
        let name = req.body.username
        let password = req.body.password
        var warn = { "warn": 0, "message": '', role: '' };
        User.findOne({ username: name }, function(err, user) {
            if (err) {
                console.log(err)
            } else {
                if (user) {
                    user.checkPassword(password, function(err, isMatch) {
                        if (isMatch) {
                            req.session.loginUser = name
                            req.session.role = user.role
                            req.session._id = user._id
                            warn.warn = 0
                            warn.role = user.role
                            return res.json(warn)
                        } else {
                            warn.warn = 2;
                            warn.message = '用户名或密码不正确~'
                            return res.json(warn)
                        }
                    })
                } else {
                    warn.warn = 1;
                    warn.message = '用户不存在'
                    return res.json(warn)
                }
            }
        });
    })
    return router
}