function filterText(text){
	return text.replace(/[<>&#\/\\]/g,function(r){
		return {
			'<':'＜',
			'>':'＞',
			'&':'＆',
			'#':'＃',
			'\\':'＼',
			'/':'／'
		}[r];
	});
}