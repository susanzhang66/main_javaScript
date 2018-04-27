//对象
var makeSound = function( animal ){
      animal.sound();
}
//不同的操作
var Duck = function(){};

Duck.prototype.sound = function(){
	console.log('嘎嘎嘎');
}
//不同的行为
var Chicken = function(){};

Chicken.prototype.sound = function(){
	console.log('咯咯咯');
}

makeSound( new Duck() );
makeSound( new Chicken() );
