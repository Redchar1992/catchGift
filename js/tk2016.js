$(document).ready(function(){
	var w = document.documentElement.clientWidth || document.body.clientWidth;
	var h = document.documentElement.clientHeight || document.body.clientHeight;
//	$("#listPage").css({"height":h,"width":w,"overflow":"hidden"});

	$(".record").click(function(){
		$(this).attr("src","images/recorded.png");
		$(".board,.jLus").show();
		$("body").css("margin-top","-50%");
	});
	$(".back").click(function(){
		$(".back").css({"background":"url(images/backMained.png) no-repeat","background-size":"100%"});
		var timerBack = setTimeout(function(){window.location.href = "main.html";},100);	
	});
	$(".board").click(function(){
		$(".record").attr("src","images/record.png");
		$(".board,.jLus").hide();
		$("body").css("margin-top","0%");
	});

	//提交手机号
	$(".reg a").click(function(){
		// 手机号错误
		var mobilePhone = document.getElementById("mobileAccount").value;
		if(mobilePhone==""  || mobilePhone.length != 11 || !checkPhone(mobilePhone)){
			$(".mini_bd").show();
			$(".mini_bd").html("请输入正确的手机号");
			$(".mini_bd").delay(300);
			$(".mini_bd").fadeOut(700);
		}
		else{
			window.location.href = "game/index.html";
		}
	});
});

//验证电话号码
function checkPhone(s) {
	var regu = /^13[0-9]{1}[0-9]{8}$|15[012356789]{1}[0-9]{8}$|18[0123456789]{1}[0-9]{8}$|14[57]{1}[0-9]{8}$|17[0678]{1}[0-9]{8}$/;
	if (regu.test(s)) {return true;}
	else {return false;}
}

var move = function(e) {
	e.preventDefault && e.preventDefault();
	e.returnValue = false;
	e.stopPropagation && e.stopPropagation();
	return false;
}
function noscroll(){
	document.documentElement.style.overflow = 'hidden';
	document.body.style.overflow = 'hidden';
}
function remliste() {window.removeEventListener('touchmove', move);}//取消禁止滚动
function addliste() {window.addEventListener('touchmove', move);}//禁止滚动