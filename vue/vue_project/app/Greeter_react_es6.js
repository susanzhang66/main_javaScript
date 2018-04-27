// 使用es6来演示。
//Greeter,js
import React, {Component} from 'react'
import config from './config.json';
import styles from './import.css';   //导入

class Greeter extends Component{
  render() {    //react语法
    return (
      <div className={styles.root}>   
        {config.greetText}
      </div>
    );
  }
}

export default Greeter