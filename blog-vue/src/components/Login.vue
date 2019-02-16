<template>
  <div id="login">
    <div id="Sin">
      <h1>Login</h1>
      <form id="form1">
        <div id="user">
          <!-- <label for="userid">用户名</label>
          <input class="text" id="username" type="text" value="" v-model="username" @blur="checkUser" ref="username"> -->
          <el-input type="text" id="username" placeholder="用户名" v-model="username" @blur="checkUser"></el-input>
        </div>
        <div id="pw">
          <!-- <label for="password">密码</label>
          <input class="text" id="password" type="password" @keyup="login($event)" value="" v-model="password" @blur="checkPw" ref="password"> -->
           <el-input type="password" id="password" placeholder="密码" v-model="password" @keyup.enter.native="doLogin" @blur="checkPw"></el-input>          
        </div>
        <el-button id="regist" type="button" @click="regist">注册</el-button>
        <el-button id="submit" type="button" @click="doLogin">登录</el-button>
      </form>
    </div>
  </div>
</template>

<script>
  export default({
    name: 'Login',
    data() {
      return{
        username: '',
        password: '',
        userwarn: '',
        pwwarn: '',
        validation: {
          "div":["user","pw"],
          "message":{
              "user":"请检查用户名是否正确~",
              "pw":"请检查密码是否正确~"
          }
        }
      }
    },
    methods: {
      regist:function(){
        this.$router.push({path:'/regist'});
      }
      ,
      checkUsername:function(user){
        if(user.match(/^[a-zA-Z]\w{5,17}$/))return 0;
        else return 1;
      }
      ,
      checkUser:function(){
        var state=this.checkUsername(this.username);
        if(state){
          this.$message(this.validation.message.user);
        }
      }
      ,
      checkPassword:function(pw){
        if(pw.match(/^[0-9a-zA-Z_-]{6,12}$/))return 0;
        else return 1;
      }
      ,
      checkPw:function(){
        var state=this.checkPassword(this.password);
        if(state){
          this.$message(this.validation.message.pw);
        }
      }
      ,
      checkAll:function(user,pw){
      var warn={"warn":0,"user":0,"pw":0};
      warn["user"]=this.checkUsername(user);
      warn["pw"]=this.checkPassword(pw);
      if(warn["user"]||warn["pw"])warn["warn"]=1;
      return warn;
      }
      ,
      doLogin:function(){
        var user=this.username;
        var pw=this.password;
        var warn=this.checkAll(user,pw);
        if(warn["warn"])
            for(var i in warn){
                if(i!="warn"){
                    if(warn[i])
                      this.$message(this.validation.message[i]);
                }
            }
        if(warn["warn"])return false;
        else{
          this.$http.post('http://localhost:3000',{
            username:user,
            password:pw
          })
          .then(res=>{
            console.log(res.data);//在浏览器中打印服务端返回的数据(调试用)
            if(res.data.warn){
              this.$message(res.data.message);
            }
            else{
              //设置Vuex登录状态
              this.$store.dispatch("SetUser", user);
              this.$router.push("/home");
            }
          }
          ,err=>{
            console.log(err)
          })
        } 
      }
    }
  })
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  #login{
    width: 260px;
    height: auto;
    margin: 100px auto 20px auto;
    text-align: center;
  }
  #Sin form div{
    margin:40px 0 40px 0;
    position: relative;
    height: 30px;
  }
  #regist{
    position: relative;
    background-color: lightblue;
    top: 40px;
    right: 20px;
  }
  #submit{
    position: relative;
    left: 30px;
    top: 40px;
    background-color: lightgreen;
  }
</style>
