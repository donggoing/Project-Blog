<template>
    <div id="container">
        <div id="Sup">
            <h1 id="regist">Regist</h1>
            <form id="form1">
                <div id="user">
                <label for="userid">用户名</label>
                <input class="text" id="userid" type="text" value="" v-model="user" @blur="checkCur('user')" title="用户名6~18位英文字母、数字或下划线，必须以英文字母开头">
                <p class='warn'>{{warnuser}}</p>
                </div>
                <div id="tele">
                <label for="telenum">电话</label>
                <input class="text" id="telenum" type="text" value="" v-model="tele" @blur="checkCur('tele')" title="电话11位数字，不能以0开头">
                <p class='warn'>{{warntele}}</p>
                </div>
                <div id="email">
                <label for="email1">邮箱</label>
                <input class="text" id="email1" type="text" value="" v-model="email" @blur="checkCur('email')" title="邮箱由大小写字母、_、.、-及@组成">
                <p class='warn'>{{warnemail}}</p>
                </div>
                <div id="password">
                <label for="password">密码</label>
                <input class="text" id="pw" type="password" value="" v-model="password" @blur="checkCur('password')" title="6~12位数字、大小写字母、中划线、下划线">
                <p class='warn'>{{warnpassword}}</p>
                </div>
                <div id="rcpassword">
                <label>确认密码</label>
                <input class="text" id="rcpw" type="password" value="" v-model="rcpassword" @blur="checkCur('rcpassword')" title="确认两次密码一致">
                <p class='warn'>{{warnrcpassword}}</p>
                </div>
                <el-button id="reset" type="reset"  @click="reset" name="reset">重置</el-button>
                <el-button id="submit" @click="checkForm" name="submit">提交</el-button>
                <br/>
                <router-link :to="{path:'/login'}">
                    <el-button id="login" >已有账号,登录</el-button>
                </router-link>
            </form>
        </div>
    </div>

</template>

<script>
export default {
    name: 'Regist',
    data () {
        return {
            user: "",
            tele: "",
            email: "",
            password: "",
            rcpassword: "",
            warnuser: "",
            warntele: "",
            warnemail: "",
            warnpassword: "",
            warnrcpassword: "",
            validation: {
                div:["user","tele","email","password","rcpassword"],
                message:{
                    user:["用户名长度为6~18~","用户名必须以英文字母开头~",
                    "用户名中只能含有英文字母、数字或下划线~","该用户名已被使用"],
                    tele:["电话长度应该等于11~","号码不能以0开头哟~",
                    "电话号码中只能包含数字哟~",
                    "该电话号码已被注册"],
                    email:["请检查邮箱是否正确~","该邮箱已被注册~"],
                    password:["密码为6~12位数字、大小写字母、中划线、下划线"],
                    rcpassword:["两次密码输入不一致哦~"]
                }
            }   
        }
    },
    computed:{

    },
    methods:{
        reset(){
            for(var i=0;i<5;i++){
                var w="warn"+this.validation.div[i];
                this[w]="";
                //eval('this.warn'+info+'=""');
            }
        }
        ,
        printWarn(index,messind){
            var tar="warn"+this.validation.div[index];
            this[tar]=messind;
        }
        ,
        checkUser(user){
            if(user.match(/^[a-zA-Z]\w{5,17}$/))return 0;
            else if(user.length<6||user.length>18)return 1;
            else if(!user[0].match(/[a-zA-Z]/))return 2;
            else return 3;
        }
        ,
        checkTele(tele){
            if(tele.match(/^[1-9]\d{10}$/))return 0;
            else if(tele.length!=11)return 1;
            else if(tele[0]=='0')return 2;
            else return 3;
        }
        ,
        checkEmail(email){
            if(email.match(/^[0-9a-zA-Z_\-]+@(([0-9a-zA-Z_\-])+\.)+[a-zA-Z]{2,4}$/))return 0;
            else return 1;
        }
        ,
        checkPassword(pw){
            if(pw.match(/^[0-9a-zA-Z_-]{6,12}$/))return 0;
            else return 1;
        }
        ,
        checkRcpassword(rcpw){
            if(rcpw===this.password)return 0;
            else return 1;
        }
        ,
        checkFieldValid(fieldName,value){
            var fun=fieldName[0].toUpperCase()+fieldName.slice(1,fieldName.length);
            return this["check"+fun](value);
        }
        ,
        checkCur(id){
            var res=this.checkFieldValid(id,this[id]);
            if(res){
                this.printWarn(this.validation.div.indexOf(id),this.validation.message[id][res-1])
            }
            else this.printWarn(this.validation.div.indexOf(id),'')
        }
        ,
        checkAll(user,tele,email,pw,rcpw){
            var warn={"warn":0,"user":0,"email":0,"tele":0,"password":0,"rcpassword":0};
            warn["user"]=this.checkUser(user);
            warn["tele"]=this.checkTele(tele);
            warn["email"]=this.checkEmail(email);
            warn["pw"]=this.checkPassword(pw);
            warn["rcpw"]=this.checkRcpassword(rcpw);
            if(warn["user"]||warn["tele"]||warn["email"]||warn["password"]||warn["rcpassword"])warn["warn"]=1;
            return warn;
        }
        ,
        checkForm(){
            this.reset();
            var user=this.user;
            var email=this.email;
            var tele=this.tele;
            var pw=this.password;
            var rcpw=this.rcpassword;
            var warn=this.checkAll(user, tele, email,pw,rcpw);
            if(warn["warn"])
                for(var i in warn){
                    if(i!="warn"){
                        if(warn[i])this.printWarn(this.validation.div.indexOf(i),this.validation.message[i][warn[i]-1]);
                    }
                }
            if(warn["warn"])return false;
            else{		  
                this.$http.post('/regist',
                    {
                        user: user,
                        tele: tele,
                        email: email,
                        password: pw,
                        rcpassword: rcpw
                    })
                    .then(result=>{
                        result=result.data
                        if(typeof(result.warn)=="undefined"||result.warn===-1){
                            this.$message("注册失败，请重试！")
                            return
                        }
                        if(result.warn){
                            for(var i in result)
                                if(i!="warn"&&i!="same"&&result[i])
                                    this.printWarn(this.validation.div.indexOf(i),this.validation.message[i][warn[i]-1])
                        }
                        else if(result.same){
                            for(var i in result)
                                if(i!="warn"&&i!="same"&&result[i])
                                    this.printWarn(this.validation.div.indexOf(i),this.validation.message[i][this.validation.message[i].length-1])
                        }
                        else{
                            //设置Vuex登录状态
                            this.$store.dispatch("SetUser", user);
                            //iViewUi的友好提示
                            this.$router.push("/home");
                        }
                    },
                    err=>{
                        console.log(err);
                    })
                
            }
        }
    }

}
</script>

<style scoped>
    body{
        font-size: 16px;
    }
    #container{
        width: 260px;
        height: auto;
        margin: 100px auto 20px auto;
        text-align: center;
        position:relative;
        right:50px;
    }
    #form1{
        width: 300px;
    }
    #regist{
        margin-bottom:40px
    }
    #Sup p,#Sup label{
        position: absolute;
        left:30px;
        text-align: left;
    }
    #Sup form div{
        position: relative;
        height: 40px;
    }
    #Sup .text{
        position: absolute;
        right:0;
        width:160px;
    }
    #Sup p.warn{
        position: absolute;
        left: 300px;
        margin: 0;
        width: 200px;
        color: red;
        text-align: left;
        font-size: 15px;
    }
    .btn{
        margin-top: 10px; 
        border-radius: 30%;
        height: 30px;
        width: 50px;
        outline-width: 0;
    }
    #reset{
        background-color: lightblue;
    }
    #submit{
        position: relative;
        left: 30px;
        background-color: lightgreen;
    }
    #login{
        width:70%;
        margin: 10px 0 0 30px;
    }
</style>
