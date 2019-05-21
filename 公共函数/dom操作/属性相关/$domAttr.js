/*
函数描述： 兼容 setAttribute
设置或取得dom元素的属性,对一些属性名称做了兼容处理
参数:
elem:需要操作属性的dom元素
name:需要操作的属性名称
[val:需要设置的属性名]不设置为获取属性值
*/
var $domAttr = (function() {
    var fixAttr = {
        tabindex: 'tabIndex',
        readonly: 'readOnly',
        'for': 'htmlFor',
        'class': 'className',
        maxlength: 'maxLength',
        cellspacing: 'cellSpacing',
        cellpadding: 'cellPadding',
        rowspan: 'rowSpan',
        colspan: 'colSpan',
        usemap: 'useMap',
        frameborder: 'frameBorder',
        contenteditable: 'contentEditable'
    },
    suppor,
    div = document.createElement( 'div' );  

    div.setAttribute('class', 't');     
    suppor = div.className === 't';
    div = null;
    return function(elem, name, val) {
            elem[val ? "setAttribute" : "getAttribute"](suppor ? name : (fixAttr[name] || name), val);
    }
})();

/*
调用示例： 
$domAttr( item , "class" , "curr");

*/