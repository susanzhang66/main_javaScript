<template>
  <section class="leayer">
      <div class="dialog">
          <div class="pop-change">
              <h2>日费率变更提醒</h2>
              <p>根据您的综合信用评分，日费率发生变更，请您重新申请。</p>
          </div>
          <div class="dialog-flex">
              <div class="b-txt red" @click="goBack">重新申请</div>
          </div>
      </div>
  </section>
</template>

<script>
export default {
  name: 'loanInfo-tip',
  methods: {
    goBack () {
      this.$router.push({
        name: 'account'
      })
    }
  }
}
</script>
