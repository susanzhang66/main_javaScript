function getLength( str ){
	var a = str.length , b = str.match(/[^\x00-\x80]/ig);
	if( b != null ) a += b.length * 1;
	return a;
}