<template>
  <router-view :renderPage="renderPage"></router-view>
</template>

<script>

export default {
  name: 'index',
  data () {
    return {
      renderPage: false
    }
  },
  methods: {
    queryUserApplyState () {
      this.$store.commit('setAccountParams', {
        paramsKey: 'userApplyStateParams',
        jsonPara: JSON.stringify({
          applyNo: ''
        })
      })
      this.$store.dispatch('queryUserApplyState').then((data) => {
        if (data.resultCode === '1' && data.subProcessCode === 'RP') {
          this.renderPage = true
        } else {
          this.$tip.show({message: data.resultMsg})
        }
      })
    }
  },
  created () {
    this.queryUserApplyState()
  }
}
</script>
