var itemsLayer;//礼物/炸弹下落层
var cart;//承接物
var xSpeed = 0;//X轴移动速度
var bloods = 3;//血量
var scoreL = 0;//分数
var density;//下落密度（暂不可控）
var ratio = 0.2;//炸弹比率
var flowSpeed = 4;//下落速度
var direction = 0;//方向
var worth = 0;//价值
var ps = 0;//接到奖品数量
var bs = 0;//接到炸掉数量
var pauseSwitch = 0;//暂停状态

//场景定义与扩展
var gameScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		gameLayer = new game();
		gameLayer.init();
		this.addChild(gameLayer);
	}
});
var game = cc.Layer.extend({
	init:function () {
		this._super();
		backgroundLayer = cc.Sprite.create("assets/gameBg.jpg");
		this.addChild(backgroundLayer,0);
		backgroundLayer.setPosition(160,240);

		numLayer = cc.Layer.create();
		this.addChild(numLayer);

		numOne = cc.Sprite.create("assets/0.png");
		numLayer.addChild(numOne,0);
		numOne.setPosition(54,280);
		numTwo = cc.Sprite.create("assets/0.png");
		numLayer.addChild(numTwo,0);
		numTwo.setPosition(124,280);
		numThree = cc.Sprite.create("assets/0.png");
		numLayer.addChild(numThree,0);
		numThree.setPosition(194,280);
		numFour = cc.Sprite.create("assets/0.png");
		numLayer.addChild(numFour,0);
		numFour.setPosition(264,280);
		
		itemsLayer = cc.Layer.create();
		this.addChild(itemsLayer);
		topLayer = cc.Layer.create();
		this.addChild(topLayer);
		cart = cc.Sprite.create("assets/cart.png");
		topLayer.addChild(cart,2);
		cart.setPosition(160,35);
		oldFool = cc.Sprite.create("assets/oldFool.png");
		topLayer.addChild(oldFool,3);
		oldFool.setPosition(282,385);
		pause = new MyPause();
		topLayer.addChild(pause,3);
		pause.setPosition(265,445);
		//--------------------------------------------------初始暂停等待开始
		cc.director.pause();
		$(".start").click(function(){
			$(".start img").attr("src","assets/started.png");
			setTimeout(function(){
				cc.director.resume();
				$(".start,.tip,.hint,.board,.hmLine").hide();
				pauseSwitch = 1;//----------------------------------------------------------------点击开始后可以暂停
			},200);
			vChange();
			gameLayer.changeScore(pause,'pause');
	        pauseSwitch = 1;
		});
		density = 0.6;//下落密度
		scoreL = 0;//分数清空
		ratio = 0.2;//炸弹比率
		flowSpeed = 4;//下落速度
		this.schedule(this.addItem,density);
		cc.eventManager.addListener(touchListener, this);
		this.scheduleUpdate();
	},
	addItem:function(){
		var item = new Item();
		itemsLayer.addChild(item,9);
	},
	removeItem:function(item){
		itemsLayer.removeChild(item);
	},
	update:function(dt){
		if(xSpeed>0){
			cart.setFlippedX(true);
		}
		if(xSpeed<0){
			cart.setFlippedX(false);
		}
		//--------------------------------------------------------------------------------边界控制ok（车半径75->48）
		if(cart.getPosition().x>48&&cart.getPosition().x<272){
			cart.setPosition(cart.getPosition().x+xSpeed,cart.getPosition().y);
		}
		else if(cart.getPosition().x>=272){
			if(xSpeed>0){cart.setPosition(272,cart.getPosition().y);}
			else{cart.setPosition(cart.getPosition().x+xSpeed,cart.getPosition().y);}
		}
		else if(cart.getPosition().x<=75){
			if(xSpeed<0){cart.setPosition(48,cart.getPosition().y);}
			else{cart.setPosition(cart.getPosition().x+xSpeed,cart.getPosition().y);}
		}
	},
	changeScore:function(wei,shu){
		wei.initWithFile("assets/"+shu+".png");
	}
});
var Item = cc.Sprite.extend({
	ctor:function() {
		this._super();
		if(Math.random()<ratio){//--------------------------------------------------------------------炸弹比率ok
			this.initWithFile("assets/bomb.png");
			this.isBomb=true;
		}
		else{//---------------------------------------------------------------------------------------各个礼物比率ok
			var biLv = Math.floor(Math.random()*100);
			if(biLv<35){this.initWithFile("assets/prise1.png");this.worth=1;}
			else if(biLv<65){this.initWithFile("assets/prise2.png");this.worth=2;}
			else if(biLv<85){this.initWithFile("assets/prise4.png");this.worth=4;}
			else if(biLv<95){this.initWithFile("assets/prise5.png");this.worth=5;}
			else{this.initWithFile("assets/prise3.png");this.worth=3;}
			this.isBomb=false;
//			console.log(this.worth);
		}
	},
	onEnter:function() {
		this._super();
		this.setPosition(Math.random()*280+20,470);
		var moveAction = cc.MoveTo.create(flowSpeed, new cc.Point(Math.random()*280+20,-50));
		this.runAction(moveAction);
		this.scheduleUpdate();
	},
	update:function(dt){
		//-----------------------------------------------------------------------------------------广义礼物下落范围
		if(this.getPosition().y<60 && this.getPosition().y>45 && Math.abs(this.getPosition().x-cart.getPosition().x)<60 && !this.isBomb){
			gameLayer.removeItem(this);
			scoreL+=100;
			ps++;
			console.log("PRISE"+ps);
			console.log(this.worth);
			console.log(scoreL);
			//---------------------------------------------------------------------------------分数
			var ge = scoreL%10;
			var shi = Math.floor(scoreL%100/10);
			var bai = Math.floor(scoreL%1000/100);
			var qian = Math.floor(scoreL%10000/1000);
			gameLayer.changeScore(numOne,qian);
			gameLayer.changeScore(numTwo,bai);
			gameLayer.changeScore(numThree,shi);
			gameLayer.changeScore(numFour,ge);
			//------------------------------------------------------------------------------------难度控制
			if(scoreL>1000&&scoreL<=3000){ratio = 0.3;}
			else if(scoreL>3000&&scoreL<=5000){ratio = 0.5;flowSpeed = 3;}
			else if(scoreL>5000&&scoreL<=7000){ratio = 0.6;}
			else if(scoreL>7000&&scoreL<=8000){ratio = 0.8;}
			else if(scoreL>8000&&scoreL<=9000){ratio = 0.9;}
			else if(scoreL>9000&&scoreL<=9800){ratio = 0.95;}
			else if(scoreL>9800){ratio = 1;}
		}
		if(this.getPosition().y<60 && this.getPosition().y>30 && Math.abs(this.getPosition().x-cart.getPosition().x)<60 && this.isBomb){
			gameLayer.removeItem(this);
			console.log("BOMB");
			bs++;
			if(bs==3){//----------------------------------------------------------------------结束判断（新）
				$(".popS,.board").show();//-----------------------------------------------------------显示得分弹窗
				console.log("game over2,score:"+scoreL);
				$(".last .result").html(scoreL);//----------------------------------------------得分
				cc.director.runScene(new gameScene()); //初始化生效
				$(".blood li").show();
				$(".start img").attr("src","assets/start.png");
				$(".last span").css({"background":"url(assets/btn.png) no-repeat","background-size":"100%"});
				cc.director.pause();//暂停生效
				bloods = 3;//血量重置
				bs = 0;//接到炸弹数重置
				pauseSwitch = 0;//暂停重置
			}
			else{
				bloods--;
				$(".blood li").eq(bloods).hide();
			}
			$(".bang").show().css({"left":this.getPosition().x-35+"px","bottom":this.getPosition().y-32+"px"}).fadeOut(500);
		}
		if(this.getPosition().y<-30){
			gameLayer.removeItem(this);
		}
	}
});
var touchListener = cc.EventListener.create({
	event: cc.EventListener.TOUCH_ONE_BY_ONE,
	swallowTouches: true,
	onTouchBegan: function (touch, event) {
		if(touch.getLocation().x < 160){
			xSpeed = -5;
			direction = -2;
		}
		else{
			xSpeed = 5;
			direction = 2;
		}
		return true;
	},
	onTouchEnded:function (touch, event) {
		xSpeed = 0;
	}
})
var MyPause = cc.Sprite.extend({
	ctor:function(){
		this._super();
		this.initWithFile("assets/pause.png");
		cc.eventManager.addListener(pauseListener, this);
	}
})
var pauseListener = cc.EventListener.create({
	event: cc.EventListener.TOUCH_ONE_BY_ONE,
	swallowTouches: true,
	onTouchBegan: function (touch, event) {
		var target = event.getCurrentTarget();    // 获取事件所绑定的 target
        // 获取当前点击点所在相对按钮的位置坐标
        var locationInNode = target.convertToNodeSpace(touch.getLocation());   
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);
        if (cc.rectContainsPoint(rect, locationInNode)) {        // 点击范围判断检测
            cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
            if(pauseSwitch==1){target.initWithFile("assets/continue.png");pauseSwitch = 2;cc.director.pause();}
            else if(pauseSwitch==2){target.initWithFile("assets/pause.png");pauseSwitch = 1;cc.director.resume();}
            console.log("hello 2016");
            return true;
        }
        return false;
	}
});
//-----------------------------------------------------------弹窗

var app = false;
if(app){
	$(".popS .last").css("height",270+"px");
	$(".last .down").hide();
}
else{
	$(".popS .last").css("height",310+"px");
	$(".last .down").show();
}
//再来一次
$(".close,.again").click(function(){
	$(".popS,.arrow").hide();
	$(".hint,.hmLine,.start").show();
})
//下载APP
$(".last .down").click(function(){
	window.location.href = "#";//此处跳转下载APP链接
})
//分享
$(".share").click(function(){
	$(".arrow").show();
})
//查看排名
$(".list").click(function(){
	setTimeout(function(){window.location.href = "../list.html";},200);
})
var w = document.documentElement.clientWidth || document.body.clientWidth;
var kuan = parseInt(w);
$(".popS").css("left",(kuan-300)/2+"px");
$(".close").css("right",(kuan-300)/2+5+"px");
//弹窗按钮变化
$(".last span").click(function(){
	$(this).css({"background":"url(assets/btned.png) no-repeat","background-size":"100%"});
});

function vChange(){
	document.addEventListener("visibilitychange", function() {
	    if (document.hidden) {  
	        cc.director.pause();
	        gameLayer.changeScore(pause,'continue');
	        pauseSwitch = 2;
	        console.log("pause");
	    } else {
			console.log("手动恢复");
	    }
	});
}