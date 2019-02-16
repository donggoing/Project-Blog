module.exports={
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
    checkPw(pw){
        if(pw.match(/^[0-9a-zA-Z_-]{6,12}$/))return 0;
        else return 1;
    }
    ,
    checkRcpw(rcpw,pw){
        if(rcpw===pw)return 0;
        else return 1;
    }
    ,
    checkAll(user,tele,email,pw,rcpw){
        var warn={"warn":0,"same":0,"user":0,"stuid":0,"email":0,"tele":0,"password":0,"rcpassword":0};
        warn["user"]=this.checkUser(user);
        warn["tele"]=this.checkTele(tele);
        warn["email"]=this.checkEmail(email);
        warn["password"]=this.checkPw(pw);
        warn["rcpassword"]=this.checkRcpw(rcpw,pw);
        if(warn["user"]||warn["tele"]||warn["email"]||warn["password"]||warn["rcpassword"])warn["warn"]=1;
        return warn;
    }
}