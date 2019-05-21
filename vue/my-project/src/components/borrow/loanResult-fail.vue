<template>
  <body>
    <section class="containter">
        <section class="result">
            <div class="icon-result icon-fail"></div>
            <h2>系统开小差啦，请稍后再试......</h2>
        </section>
    </section>
    <footer class="fixed fixed-wrap" style="position:absolute">
        <div class="btn-flex">
            <div class="btn" @click="goAccount">确定</div>
        </div>
    </footer>
  </body>
</template>

<script>

export default {
  name: 'loanResultFail',
  data () {
    return {}
  },
  created () {
  },
  methods: {
    goAccount () {
      this.$router.push({
        name: 'account'
      })
    }
  }
}

</script>
