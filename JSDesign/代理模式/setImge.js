var myImage = (function(){
	var imageNode = document.createElement('img');
	document.body.appendChild( imageNode );

	return {
		setSrc: function( src ){
			imageNode.src = src;
		}
	}
})()

var proxyImage = (function(){
	var img = new Image();
	img.onload = function(){
		myImage.setSrc( this.src );
	}
	return {
		setSrc: function(){
			myImage.setSrc('http://xxx.baidu.com/loading.gif');
			img.src = src;
		}
	}
})()