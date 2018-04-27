  // import _ from 'lodash';
  // import './style.css';
  // import printMe from './print.js';
  // import Icon from './im7.png';

  import { cube } from './math.js';

  function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    // Lodash，现在由此脚本导入
    // element.innerHTML = '测试啦测试啦测试啦啊'
   element.innerHTML = [
     'Hello webpack!',
     '5 cubed is equal to ' + cube(5)
   ].join('\n\n');

    // btn.innerHTML = 'Click me and check the console!';

    // btn.onclick = printMe;

    element.appendChild(btn);

    // 将图像添加到我们现有的 div。
    // var myIcon = new Image();
    // myIcon.src = Icon;

    // element.appendChild(myIcon);

    return element;
  }

  document.body.appendChild(component());


// if (module.hot) {
//   module.hot.accept('./print.js', function() {
//      console.log('Accepting the updated printMe module!');
//      printMe();
//    })
//  }




