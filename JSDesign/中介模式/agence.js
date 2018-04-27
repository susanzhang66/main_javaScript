//中介者模式
// 优点：解除对象与对象之间的紧耦合关系。增加一个中介者对象，让所有对象都通过中介者对象来通信。

function Player( name, teamColor){
	this.name = name;
	this.teamColor = teamColor;
	this.state = 'alive';
}

Player.prototype.win = function(){
	console.log( this.name + 'won');
}

Player.prototype.lose = function(){
	console.log( this.name + 'lose');
}

Player.prototype.dead = function(){
	this.state = 'dead';
	playerDirector.ReceiveMessage('playerDead', this );

}

Player.prototype.remove = function(){

	playerDirector.ReceiveMessage('removePlayer', this );

}

Player.prototype.changeTeam = function( color ){

	playerDirector.ReceiveMessage('changeTeam', this, color );

}

var playFactory = function( name, teamColor ){
	var newPlayer = new Player( name, teamColor );
	playerDirector.ReceiveMessage('addPlayer', newPlayer);

	return newPlayer;
}
//创建中介者
// 1.通过中介者开放一些接收消息的接口，各个对象可以通过该接口来给中介者发送消息，中介者处理后通知到其他对象。
// 2.也可以通过发布－订阅方式。
var playerDirector = (function(){
	var players = {},   //所有玩家
		operations = {};    //中介者行为操作
	operations.addPlayer = function( player ){
		var teamColor = player.teamColor;
		players[ teamColor ] = players[ teamColor ] || [];
		players[ teamColor ].push( player );
	};
	//移除一个玩家
	operations.removePlayer = function( player ){
		var teamColor = player.teamColor;
		teamPlayers = players[ teamColor ] || [];
		for( var i = teamPlayers.length -1; i>=0; i-- ){
			if( teamPlayers[i] == player ){
				teamPlayers.splice( i, 1 );
			}
		}
	};
	//玩家换队
	operations.changeTeam = function( player, newTeamColor ){
		operations.removePlayer( player );
		player.teamColor = newTeamColor;
		operations.addPlayer( player );
	};
	//玩家死亡
	operations.playerDead = function( player ){
		var teamColor = player.teamColor,
			teamPlayers = players[ teamColor ];
		var all_dead = true;
		for( var i= 0, player; player = teamPlayers[ i++ ];){
			if( player.state != 'dead'){
				all_dead = false;
				break;
			}
		}
		if( all_dead === true ){
			for( var i= 0, player; player = teamPlayers[ i++ ];){
				player.lose();
			}
		}
		for( var color in players ){
			if( color !== teamColor ){
				var teamPlayers = players[ color ];
				for( var i= 0, player; player = teamPlayers[ i++ ];){
					player.win();
				}
			}
		}
	};
	var ReceiveMessage = function(){
		var message = Array.prototype.shift.call( arguments );
		operations[ message ].apply( this, arguments );
	}
	return {
		ReceiveMessage: ReceiveMessage
	}
})()

