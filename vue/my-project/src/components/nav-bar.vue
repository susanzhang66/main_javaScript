<template>
<div>
  <div class="nav-space">
    <div class="nav-item">
      <div class="nav-title">title</div>
    </div>
  </div>
  <div class="red nav-bar">
    <div class="nav-item flex-left">
      <div class="nav-back" v-if="back" v-on:click="backFuc">
        <img src="../assets/images/icon-left-red.png" alt="返回">
      </div>
    </div>
    <div class="nav-item flex-middle">
      <div class="nav-title">{{ pageName }}</div>
    </div>
    <div class="nav-item flex-right">
      <div class="nav-right" v-if="rightText" v-on:click="rightFuc">{{ rightText }}</div>
    </div>
  </div>
</div>
</template>

<script>

export default {
  name: 'nav-bar',
  props: {
    'pageName': {
      type: String,
      required: true
    },
    'back': {
      type: Boolean,
      default: false
    },
    'backFuc': {
      type: Function,
      default: function () {}
    },
    'rightText': {
      type: String,
      default: ''
    },
    'rightFuc': {
      type: Function,
      default: function () {}
    }
  }
}
</script>

<style>
.nav-bar {
  position: fixed;
  z-index: 89;
  top: 0;
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  background-color: #efefef;
  border-bottom: 1px solid #d9d9d9;
}
.nav-space {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  border-bottom: 1px solid transparent;
  color: transparent;
}
.nav-item {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  position: relative;
  line-height: 0.5rem;
  padding: 0.2rem 0;
}
.flex-left {
  flex: 1;
}
.flex-middle {
  flex: 2;
}
.flex-right {
  flex: 1;
}
.nav-back {
  margin-left: 0.4rem;
}
.nav-back img{
  height: 0.34rem;
  vertical-align: middle;
}
.nav-title {
  font-size: 0.34rem;
  font-weight: bold;
  text-align: center;
}
.nav-right {
  text-align: right;
  margin-right: 0.4rem;
  font-size: 0.3rem;
}
</style>
