var validation={
    "div":["user","pw"],
    "message":{
        "user":"请检查用户名是否正确~",
        "pw":"请检查密码是否正确~"
    }
}
window.onload=function(){
	$("#reset").on("click",function(){
		$(".warn").remove();
	})

    $("#username").blur(function(){
        var state=checkUsername($(this).val());
        $("#user p.warn").remove();
        if(state){
            printWarn('user',validation.message.user);
        }
    })

    $('#regist').on('click',function(){
        window.location.href='/regist';
    })

    $("#password").blur(function(){
        var state=checkPassword($(this).val());
        $("#pw p.warn").remove();
        if(state){
            printWarn('pw',validation.message.pw);
        }
    })

	$("#login").bind("click",checkForm);
}

function printWarn(div,message){
    $('#'+div).append("<p class='warn'>"+message+"</p>")
}

function checkUsername(user){
    if(user.match(/^[a-zA-Z]\w{5,17}$/))return 0;
    else return 1;
}

function checkPassword(pw){
    if(pw.match(/^[0-9a-zA-Z_-]{6,12}$/))return 0;
    else return 1;
}

function checkAll(user,pw){
    var warn={"warn":0,"user":0,"pw":0};
    warn["user"]=checkUsername(user);
    warn["pw"]=checkPassword(pw);
    if(warn["user"]||warn["pw"])warn["warn"]=1;
    return warn;
}

function checkForm(){
		$(".warn").remove();
		var user=$("#username").val();
        var pw=$("#password").val();
		var warn=checkAll(user,pw);
        if(warn["warn"])
            for(var i in warn){
                if(i!="warn"){
                    if(warn[i])printWarn(validation.div.indexOf(i),validation.message.i);
                }
            }
		if(warn["warn"])return false;
		else{		  
			 $.ajax({
                type: "POST",
                dataType: "json",//服务器返回的数据类型
                url: "/" ,
                data: $("#form1").serialize(),
                success: function (result) {
                    console.log(result);//在浏览器中打印服务端返回的数据(调试用)
                    if(result.warn){
                        printWarn(validation.div[result.warn-1],result.message);
                    }
                    else
                        window.location.href =result.Location;
                }
            });
		}
}
