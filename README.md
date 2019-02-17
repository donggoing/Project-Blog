> Vue+Express前后端分离Blog实践项目

- 前端使用8080默认端口,后端使用3000默认端口

- 前后端均可使用npm start开启

- 管理员权限仅需使用Robo或其他方法将mongodb数据库用户表(users)中已存在的用户的role数组中加入admin项即可

- 后端登录状态通过使用session持续化保存，前端登录状态使用localStore+vuex进行状态管理

- 前端使用了element-ui进行美化及实现分页功能，另外使用showdown用于简单的markdown文本编辑和显示(目前支持tab键缩进)