<template>
  <div class="containter login-page">
    <slogan></slogan>
    <div class="login-banner">
      <img src="../../assets/images/icon_logo.png" alt="">
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import slogan from '../slogan'

export default {
  name: 'login-index',
  components: {
    slogan
  },
  created () {
    // ios无痕模式温馨提示
    let ua = window.navigator.userAgent
    if (ua.indexOf('Safari') !== -1 && ua.indexOf('11_0 like') === -1 && window.navigator.doNotTrack && window.navigator.doNotTrack === '1') {
      this.$tip.show({message: '为了获得最佳体验，请勿使用无痕模式浏览'})
    }
  }
}
</script>

<style>
#app {
  height: inherit;
}
.login-page {
  height: 100%;
  background-color: #fff;
}
.login-info {
  color: #333;
  font-size: 0.3rem;
  background-color: #fff;
}
.login-banner {
  text-align: center;
}
.login-banner img {
  width: 1.6rem;
  margin: .9rem auto;
}
.login-title {
  padding-left: 0.55rem;
  padding-bottom: 0.3rem;
}
.login-item {
  padding: 0.3rem 0.55rem;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center; 
  -webkit-align-items: center;
  align-items: center;
  border-top: 1px solid #c8c7cc;
}
.login-item-last {
  border-bottom: 1px solid #c8c7cc;
}
.login-item-vcode {
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
}
.login-item-hd {
  width: 0.6rem;
}
.login-item-bd {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}
.login-item-bd input {
  width: 100%;
  font-size: inherit;
}
.vcode-btn {
  margin-left: 0.2rem;
  padding: 0.29rem 0.4rem;
  color: #fff;
  border-radius: 8px;
  background: #f96045;
}
.vcode-img{
  margin-left: 0.2rem;
  padding-right: 0.4rem;
  text-align: center;
}
.vcode-img-up img{
  height: 0.61rem;
  vertical-align: middle;
}
.vcode-img-down img{
  height: 0.3rem;
}
.login-title {
  padding-left: 0.5rem;
  padding-bottom: 0.3rem;
}
.login-message {
  text-align: center;
  margin: 0 1.2rem 0.55rem;
}
.login-tip {
   padding: 0.3rem 0.55rem;
}
.login-icon{
  display: inline-block;
  width: 0.32rem;  
  vertical-align: middle;
  background-size: 100%;
  background-repeat: no-repeat;
}
.icon-phone{
  height: 0.47rem;
  background-image: url(../../assets/images/icon_phone.png);
}
.icon-code{
  height: 0.4rem;
  background-image: url(../../assets/images/icon_code.png);
}
.icon-attention{
  height: 0.4rem;
  background-image: url(../../assets/images/icon_attention.png);
}
.btn-icon{
  display: inline-block;
  width: 0.47rem;
  height: 0.54rem;  
  vertical-align: middle;
  background-size: 100%;
  background-repeat: no-repeat;
}
.btn-download {
  padding: 0.28rem;
  color: #fff;
  font-size: 0.36rem;
  border-radius: 8px;
}
.btn-blue {
  background: #0079c2; 
}
.btn-green {
  background: #82b21c; 
}
.btn-gray {
  background: #a9a9a9; 
}
.icon-apple{  
  background-image: url(../../assets/images/icon_apple.png);
}
.icon-android{
  background-image: url(../../assets/images/icon_Android.png);
}
</style>
