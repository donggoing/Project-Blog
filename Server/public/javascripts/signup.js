var validation={
    div:["user","stuid","tele","email","password","rcpassword"],
    message:{
        user:["用户名长度为6~18~","用户名必须以英文字母开头~",
        "用户名中只能含有英文字母、数字或下划线~","该用户名已被使用"],
        stuid:["学号长度应等于8~","学号首位不为0哟~",
        "用户名中只能含有英文字母、数字或下划线~","该学号已被注册"],
        tele:["电话长度应该等于11~","号码不能以0开头哟~",
        "电话号码中只能包含数字哟~",
        "该电话号码已被注册"],
        email:["请检查邮箱是否正确~","该邮箱已被注册~"],
        password:["密码为6~12位数字、大小写字母、中划线、下划线"],
        rcpassword:["两次密码输入不一致哦~"]
    }
}


window.onload=function(){
	$("#reset").on("click",function(){
		$(".warn").remove();
	})

    $(".text").blur(function(){
        var state=checkFieldValid(this.name,$(this).val());
        $("#"+this.name+" p.warn").remove();
        if(state){
            printWarn(validation.div.indexOf(this.name),state-1);
        }
    })

	$("#submit").bind("click",checkForm);
}

function printWarn(index,messind){
    $('#'+validation.div[index]).append("<p class='warn'>"+validation.message[validation.div[index]][messind]+"</p>")
}

function checkUser(user){
    if(user.match(/^[a-zA-Z]\w{5,17}$/))return 0;
    else if(user.length<6||user.length>18)return 1;
    else if(!user[0].match(/[a-zA-Z]/))return 2;
    else return 3;
}

function checkStuid(stuid){
    if(stuid.match(/^[1-9]\d{7}$/))return 0;
    else if(stuid.length!=8)return 1;
    else if(stuid[0]=='0')return 2;
    else return 3;
}

function checkTele(tele){
    if(tele.match(/^[1-9]\d{10}$/))return 0;
    else if(tele.length!=11)return 1;
    else if(tele[0]=='0')return 2;
    else return 3;
}

function checkEmail(email){
    if(email.match(/^[0-9a-zA-Z_\-]+@(([0-9a-zA-Z_\-])+\.)+[a-zA-Z]{2,4}$/))return 0;
    else return 1;
}

function checkPassword(pw){
    if(pw.match(/^[0-9a-zA-Z_-]{6,12}$/))return 0;
    else return 1;
}

function checkRcpassword(rcpw){
    if(rcpw==$('#pw').val())return 0;
    else return 1;
}

function checkFieldValid(fieldName,value){
    var fun=fieldName[0].toUpperCase()+fieldName.slice(1,fieldName.length);
    return this["check"+fun](value);
}

function checkAll(user,stuid,tele,email,pw,rcpw){
    var warn={"warn":0,"user":0,"stuid":0,"email":0,"tele":0,"password":0,"rcpassword":0};
    warn["user"]=checkUser(user);
    warn["stuid"]=checkStuid(stuid);
    warn["tele"]=checkTele(tele);
    warn["email"]=checkEmail(email);
    warn["pw"]=checkPassword(pw);
    warn["rcpw"]=checkRcpassword(rcpw);
    if(warn["user"]||warn["stuid"]||warn["tele"]||warn["email"]||warn["password"]||warn["rcpassword"])warn["warn"]=1;
    return warn;
}

function checkForm(){
		$(".warn").remove();
		var user=$("#userid").val();
		var stuid=$("#sid").val();
		var email=$("#email1").val();
        var tele=$("#telenum").val();
        var pw=$("#password").val();
        var rcpw=$("#rcpassword").val();
		var warn=checkAll(user, stuid, tele, email,pw,rcpw);
        if(warn["warn"])
            for(var i in warn){
                if(i!="warn"){
                    if(warn[i])printWarn(validation.div.indexOf(i),warn[i]-1);
                }
            }
		if(warn["warn"])return false;
		else{		  
			 $.ajax({
                type: "POST",
                dataType: "json",//服务器返回的数据类型
                url: "/regist" ,
                data: $("#form1").serialize(),
                success: function (result) {
                    console.log(result);//在浏览器中打印服务端返回的数据(调试用)
                    if(result.warn){
                        for(var i in result)
                            if(i!="warn"&&i!="same"&&result[i])
                                printWarn(validation.div.indexOf(i),result.user-1);
                    }
					else if(result.same){
                        for(var i in result)
                            if(i!="warn"&&i!="same"&&result[i])
                                printWarn(validation.div.indexOf(i),validation.message[i].length-1);
                    }
                    else
                        window.location.href =result.Location;
	
                }
            });
		}
}
