/**
 * 预加载资源
 * @param {Object} url 加载资源url
 * @param {Object} callback 加载完成回调
 */
function $preload(url, callback) {
	var img = new Image(0);
	img.onload = img.onerror = img.onabort = function() {
		img.onload = img.onerror = img.onabort = null;
		callback&&callback(img);
	};
	img.src = url;
}

 
//预加载图片，加载完成后添加到文档流后面
$preload('http://static.iuniimg.com/res/bigimg.jpg',function(img){
    document.body.appendChild(img);
});