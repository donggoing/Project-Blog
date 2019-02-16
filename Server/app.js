var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var session=require('express-session');
var url=require('url');
var cors = require('cors');
var LokiStore = require('connect-loki')(session); //持续化session

// var FileStore = require('session-file-store')(session);
// var redis = require('redis');
// var RedisStore = require('connect-redis')(session);

module.exports=function(db){
  var regist = require('./routes/regist')(db)
  var login = require('./routes/login')(db)
  var logout=require('./routes/logout')
  var api=require('./routes/api')(db)
  var Aapi=require('./routes/Aapi')(db)
  
  var app = express();

  app.use(session({
    secret: 'iqjmvh-178fd-fwh8f-cfenp',
    resave: false,
    saveUninitialized: false,
    store: new LokiStore()
  }));
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cors({
    origin:['http://localhost:8080'],
    methods:['GET','POST'],
    credentials: true ,
    alloweHeaders:['Conten-Type', 'Authorization']
}));


  app.use('/regist', regist)
  app.use('/logout',logout)
  app.use('/', login)
  app.use('/api/A',Aapi)
  app.use('/api',api)

  // app.listen(3000,function(){
  //   console.log('Listen:http://localhost:3000');
  // })
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  return app
}

