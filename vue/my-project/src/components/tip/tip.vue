<template>
  <div v-show="show">
    <div class="weui-mask_transparent"></div>
    <div class="weui-toast weui-toast_wide">
      <i class="weui-icon_toast"></i>
      <p class="weui-toast__content">{{ message }}</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'tip',
  data () {
    return {
      show: false,
      message: ''
    }
  }
}
</script>
