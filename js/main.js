window.focus();
enchant();  // 初期化

var FPS = 60;    				// フレームレート
var SCENE_WID = 480;			//画面横幅
var SCENE_HGT = 720;			//画面縦幅

//画像
var GIRL_IMG = "img/girl1.png";
var HAND_IMG = "img/150_hand_a01.png";
var TOGE_IMG = "img/50_toge.png";

window.onload = function () {
    game = new Game(SCENE_WID, SCENE_HGT); // Gameオブジェクトの作成
    game.fps = FPS;				// フレームレートのセット
     var scale_h = window.innerHeight/SCENE_HGT;
　　　var scale_w = window.innerWidth/SCENE_WID;
　　　if (scale_h >= scale_w){
　　　　　game.scale = scale_w;
　　　}
　　　else{
　　　　　game.scale = scale_h;
　　　}
    game.preload(GIRL_IMG,HAND_IMG,TOGE_IMG);	// 画像の読み込み
    //game.preload(MENU_SE);//音楽の読み込み
     game.keybind(90, 'z');		// Zボタンを割り当て
     game.keybind(88, 'x');		// Xボタンを割り当て
     window.scrollTo(0, 0);

     game.rootScene.changeScene = function(level){
         console.log("change");
         game.popScene();
         gameScene = new GameScene(level);
         game.pushScene(gameScene);
     }
     game.score = 0;

     game.onload = function () {	// ゲームが開始された時の関数をセット
         gameScene = new GameScene(0);
         game.pushScene(gameScene);
     };
     game.start();

};

GameScene = enchant.Class.create(enchant.Scene,{
    initialize: function(level) {
 	   enchant.Scene.call(this);
       this.backgroundColor = 'beige';
       this.moveTo(0,0);
       this.level = level;

       stage = new Group();

       girl = new Girl();
       stage.addChild(girl);

       target1 = new Target("壁");
       //console.log(target.font-size);
       target1.font = "100px serif";
       target1.width = 100;
       target1.height = 100;
       target1.moveTo(girl.x+girl.width,girl.y+girl.height/2-target1.height/2);
       target1.backgroundColor = "orange";

       target2 = new Target("壁");
       //console.log(target.font-size);
       target2.font = "100px serif";
       target2.width = 100;
       target2.height = 100;
       target2.moveTo(girl.x-girl.width,girl.y+girl.height/2-target2.height/2);
       target2.backgroundColor = "orange";

       stage.addChild(target1);
       stage.addChild(target2);

       hand = new Hand();
       stage.addChild(hand);

       levelLavel = new MutableText(10,10);
       levelLavel.text = ("DON:" + this.level);
       this.addChild(levelLavel);

       scoreLabel = new ScoreLabel(300,10);
       scoreLabel.score = game.score;
       //var a = scoreLabel.score();
       this.addChild(scoreLabel);

       this.addChild(stage);
       console.log(girl.x);
       console.log(girl.y);
       console.log(hand.y);

       this.addEventListener('enterframe', function enterframe() {
           hand.move();
           girl.move();
           target1.move();
           target2.move();
       });

       this.addEventListener("touchstart", function(e) {
           hand.don();
           hand.y -=5;
       });

       this.addEventListener("touchend",function(e){
           hand.y +=5;
       });
   },
   changeY: function(){
       console.log("changeY");
       console.log(this.level);
       var y_speed = Math.random() * (this.level / 10);
       var y_direction =  (parseInt(Math.random() * 2) * 2) - 1;
       hand.y_speed = y_speed;
       hand.y_direction = y_direction;
       girl.y_speed = y_speed;
       girl.y_direction = y_direction;
       target1.y_speed = y_speed;
       target1.y_direction = y_direction;
       target2.y_speed = y_speed;
       target2.y_direction = y_direction;

       console.log(hand.y_speed);
   }

});

Girl = enchant.Class.create(enchant.Sprite,{
    initialize: function() {
        Sprite.call(this,100,200);
        this.image = game.assets[GIRL_IMG];
        this.moveTo(SCENE_WID/2-(this.width/2),SCENE_HGT/2-(this.height/2));
        this.x_speed = 0;
        this.x_direction = 1;
        this.y_speed = 0;
        this.y_direction = 1;
        this.scale_speed = 0;
        this.isScale = 0;
    },
    move: function(){
        if(this.x<0){
            this.x_direction = 1;
        }else if(this.x>SCENE_WID-this.width){
            this.x_direction = -1;
        }
        if(this.y<0){
            this.y_direction = 1;
        }else if(this.y>SCENE_HGT-this.height){
            this.y_direction = -1;
        }
        this.x += (this.x_speed * this.x_direction);
        this.y += (this.y_speed * this.y_direction);
    }
});

Target = enchant.Class.create(enchant.Label,{
    initialize: function(text) {
        Label.call(this,text);
        this.y_speed = 0;
        this.y_direction = 1;
    },
    move: function(){
        if(this.y<0){
            this.y_direction = 1;
        }else if(this.y>SCENE_HGT-this.height){
            this.y_direction = -1;
        }
        this.y += (this.y_speed * this.y_direction);
    }
});

Hand = enchant.Class.create(enchant.Sprite,{
    initialize: function() {
        Sprite.call(this,111,150);
        this.image = game.assets[HAND_IMG];
        this.moveTo(0,SCENE_HGT/2-(this.height/2));
        this.isMoving = true;
        this.x_direction = 1;
        this.y_direction = 1;
        this.y_speed = 0;
        this.yohaku = 25;
        this.addEventListener('enterframe', function enterframe() {
            this.x_speed = 3 + (gameScene.level/5);
        });
    },
    move: function(){
        if(this.x<0){
            this.x_direction = 1;
            gameScene.changeY();
        }else if(this.x>SCENE_WID-this.width){
            this.x_direction = -1;
            gameScene.changeY();
        }

        if(this.y<0){
            this.y_direction = 1;
        }else if(this.y>SCENE_HGT-this.height){
            this.y_direction = -1;
        }

        if(this.isMoving){
            console.log(this.y_speed);
            this.x += (this.x_speed * this.x_direction);
            this.y += (this.y_speed * this.y_direction);
        }
    },
    don: function(){
        if(this.x+this.width - this.yohaku>=girl.x && this.x + this.yohaku<girl.x+girl.width && this.y+this.height>=girl.y && this.y<girl.y+girl.height){
            console.log("girl crush");
            hand.isMoving = false;
            game.end(game.score,"score: " + game.score);
        }else if(this.x+this.width>=target1.x && this.x + this.yohaku<target1.x+target1.width && this.y+this.height>=target1.y && this.y<target1.y+target1.height){
            var score_x = target1.width - (this.x-target1.x);
            //var score_y = parseInt((target.height - (this.y-target.y)) / 2);
            var score = score_x// + score_y;
            console.log(score);
            game.score += parseInt(score);
            scoreLabel.score = game.score;
            //hand.isMoving = false;
            //game.rootScene.changeScene(gameScene.level+1);
            gameScene.level++;

            var popx = this.x - 50/2;

            var popy = Math.random() * (this.height) + this.y - 50/2;

            //TOGE
            var toge = new Sprite(49,50);
            toge.moveTo(popx,popy);
            toge.image =  game.assets[TOGE_IMG];
            stage.addChild(toge);

            //DON Toast
            levelLavel.text = ("DON:" + gameScene.level);
            var text = new Toast(popx, popy, 100);
            text.text = 'DON!';
            gameScene.addChild(text);

        }else if(this.x+this.width>=target2.x && this.x - this.yohaku<target2.x+target2.width && this.y+this.height>=target2.y && this.y<target2.y+target2.height){
            var score_x = target2.width - (target2.x - this.x);
            var score = score_x// + score_y;
            console.log(score);
            game.score += parseInt(score);
            scoreLabel.score = game.score;
            //hand.isMoving = false;
            //game.rootScene.changeScene(gameScene.level+1);
            gameScene.level++;

            var popx = this.x + 50/2;
            var popy = Math.random() * (this.height) + this.y - 50/2;

            //TOGE
            var toge = new Sprite(49,50);
            toge.moveTo(popx,popy);
            toge.image =  game.assets[TOGE_IMG];
            stage.addChild(toge);

            //DON Toast
            levelLavel.text = ("DON:" + gameScene.level);
            var text = new Toast(popx, popy, 100);
            text.text = 'DON!';
            gameScene.addChild(text);

        }
    }
});

// 出現してから徐々に上に移動しつつフェードアウトするクラス
Toast = enchant.Class.create(enchant.ui.MutableText,{
    initialize: function(x,y,width) {
        enchant.ui.MutableText.call(this,x,y,width);

        this.x_speed = 0;
        this.y_speed = -1;
        this.fadeoutTime = 0.5;

        this.endTime = (game.frame/game.fps) + this.fadeoutTime;
        this.opacity_speed = this.fadeoutTime / game.fps;
        console.log(this.opacity_speed);

        this.addEventListener('enterframe', function() {
            this.x += this.x_speed;
            this.y += this.y_speed;
            if(this.endTime==game.frame/game.fps){
                gameScene.removeChild(this);
            }
            this.opacity -= this.opacity_speed;

        });

    }
});
