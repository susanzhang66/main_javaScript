<template>
  <div>
    <p class="snow-sm">
      <span v-if="cgiMode">
        <span class="icon-sm icon-snow"></span>还款计划中已包含投保之后的相关费用，具体还款金额以放款后实际发生为准，提前还款免手续费。
      </span>
      <span v-else>
        <span class="icon-sm icon-snow"></span>具体还款金额以放款后实际发生为准，提前还款免手续费
      </span>
    </p>
    <section class="detail box-scroll">
        <div class="play-list">
            <ul>
                <li v-for="i in repayCalculateData.planList">
                    <div class="per-cent" :style="{ 'width': i.percent + '%'}">
                        <span class="fr">{{i.rpyAmt | formatMoney}}元</span>{{i.rpyDate}}
                    </div>
                </li>
            </ul>
        </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'loanRepayPlanBody',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      getLoanInfoQuery: 'getLoanInfoQuery', // 借款查询接口
      getRepayCalculate: 'getRepayCalculate'
    }),
    cgiMode () {
      return this.getLoanInfoQuery.infoMap.fundingModel.toUpperCase() === 'U' || this.getLoanInfoQuery.infoMap.fundingModel.toUpperCase() === 'D'
    },
    repayCalculateData () {
      return this.getRepayCalculate
    }
  }
}
</script>
