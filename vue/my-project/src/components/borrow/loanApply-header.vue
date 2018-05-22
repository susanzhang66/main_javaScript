<template>
  <div>
    <p class="t" v-if="loanCode === '0201'"><span class="icon-sm icon-fast"></span>最快1秒放款到账</p>
    <section class="withdrawal" v-if="loanCode === '0202'">
      <div class="f-row">
          <ul class="noTopLine" v-if="loanInfoQuery.creditCardName && loanInfoQuery.loanBindNo" @click="goSelectCardPage">
              <li>
                <div class="row">
                  <div class="col-l">收款信用卡</div>
                  <div class="col-r">
                    <span v-if="loanInfoQuery.creditCardName.length <= 18">{{loanInfoQuery.creditCardName}}</span>
                    <span v-if="loanInfoQuery.creditCardName.length > 18">{{loanInfoQuery.creditCardName.slice(0, loanInfoQuery.creditCardName.length - 9)}}<br/>
                      {{loanInfoQuery.creditCardName.slice(loanInfoQuery.creditCardName.length - 9)}}
                    </span>
                    <span class="icon-sm icon-arrow"></span>
                  </div>
                </div>
              </li>
          </ul>
          <ul v-else class="js_showLeayer noTopLine" @click="toShowTip">
            <li class="z-big">
              <div class="tac"><p class="red"><span class="icon-sm icon-add"></span>添加收款信用卡</p></div>
            </li>
          </ul>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'borrowHeader',
  props: ['loanCode'],
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      getLoanInfoQuery: 'getLoanInfoQuery'
    }),
    loanInfoQuery () {
      return this.getLoanInfoQuery.infoMap
    }
  },
  methods: {
    goSelectCardPage () {
      this.$router.push({
        name: 'selectCard'
      })
    },
    // 没有在app添加过信用卡,点击添加信用卡,弹出提示
    toShowTip () {
      this.$tip.show({message: '暂不支持绑卡，请返回普惠APP操作'})
    }
  }
}
</script>
<style>
  .noTopLine {
    border-top: 0px solid #d9d9d9 !important;
  }
</style>
