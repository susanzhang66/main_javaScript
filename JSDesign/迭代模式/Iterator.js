/*外部迭代器
**/
var Iterator = function( obj ) {
	var current = 0;

	var next = function(){
		current +=1;
	}
	var isDone = function(){
		return current >= obj.length;
	}
	var getCurrItem = function(){
		return obj[ current ];
	}
	return {
		next: next,
		isDone: isDone,
		getCurrItem: getCurrItem
	}
};

var closeDoorCommand = {
	excute: function(){
		console.log('关门')
	}
}
var openPcCommand = {
	excute: function(){
		console.log('打开电脑')
	}
}
var openMusiceCommand = {
	excute: function(){
		console.log('打开音乐')
	}
}

var MacroCommand = function(){
	return {
		commandsList: [],
		add: function( command ){ 
			this.commandsList.push( command );
		},
		excute: function(){
			for( var i = 0, command; command = this.commandsList[ i++ ]){
				command.excute();
			}
		}
	}
}

var macroCommand = MacroCommand();
macroCommand.add( closeDoorCommand );
macroCommand.add( openPcCommand );
macroCommand.add( openMusiceCommand );

macroCommand.excute();










