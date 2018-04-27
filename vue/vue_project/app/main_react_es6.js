// main.js
import React from 'react';
import {render} from 'react-dom';
import Greeter from './Greeter_react_es6';

import './main.css'; //使用require导入css文件

render(<Greeter />, document.getElementById('root'));   

//react 语法