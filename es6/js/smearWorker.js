
onmessage = function(e){
	console.log(2)
	postMessage( smear( e.data) );
}

function smear( pixels ){
    console.log(1);
	return pixels;
}