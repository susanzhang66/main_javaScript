<template>
  <section class="leayer" v-if="showRisk">
      <div class="dialog friendship">
          <div class="title"><h2>友情提示</h2></div>
          <div class="friendship-top">
              <div class="txt">根据《中华人民共和国合同法》、《中华人民共和国刑法》、最高法“限消令”的相关规定，有严重逾期、恶意拖欠、冒用身份、涉嫌贷款诈骗等情形之一的，将可能面临以下情况：</div>
              <ul class="friendship-list">
                  <li><span class="icon-ship icon-highrail"></span>不能坐高铁</li>
                  <li><span class="icon-ship icon-exit"></span>不能出境游</li>
                  <li><span class="icon-ship icon-house"></span>不能买房子</li>
                  <li><span class="icon-ship icon-nogroup"></span>不批信用卡／贷款</li>
                  <li><span class="icon-ship icon-bear"></span>承担刑事／民事责任</li>
              </ul>
          </div>
          <div class="friendship-btm">
              <p>失信有风险 请按时还款</p>
              <div class="btn" @click="hideRisk">我知道了</div>
          </div>
      </div>
  </section>
</template>

<script>

export default {
  name: 'loanResultBody',
  data () {
    return {
      showRisk: true
    }
  },
  props: {
    closeTip: {
      type: Function,
      default: null
    }
  },
  methods: {
    hideRisk () {
      this.showRisk = false
      this.closeTip()
    }
  }
}
</script>
