<template>
  <div>
    <p class="t black ptb" v-if="$route.params.loanCode === '0202'">借款信息</p>
    <div class="f-row">
        <ul class="noTopLine">
            <li>
                <div class="row">
                    <div class="col-l">姓名</div>
                    <div class="col-r">{{getLogin.custName | rsaDecrypt}}</div>
                </div>
            </li>
            <li>
                <div class="row">
                    <div class="col-l">身份证号</div>
                    <div class="col-r">{{getLogin.identityNumber | rsaDecrypt | formatIdCardNo}}</div>
                </div>
            </li>
            <li class="mul">
                <div class="row">
                    <div class="col-l" v-text="$route.params.loanCode === '0202' ? '收款账户' : '收(还)款账户'"></div>
                    <div class="col-r" :class="$route.params.loanCode === '0201' ? 'red' : ''" @click="goSelectCardPage">
                      <span v-if="creditCardName.length <= 18">{{creditCardName}}</span>
                      <span v-if="creditCardName.length > 18">{{creditCardName.slice(0, creditCardName.length - 9)}}<br/>
                        {{creditCardName.slice(creditCardName.length - 9)}}
                      </span>
                    </div>
                    <div>
                      <span class="icon-sm icon-arrow" v-if="$route.params.loanCode ==='0201'"></span>
                    </div>
                </div>
            </li>
            <li v-if="$route.params.loanCode === '0202'">
  						<div class="row">
  							<div class="col-l">借款金额</div>
  							<div class="col-r red"><strong>{{amount | formatMoney}}元</strong></div>
  						</div>
  					</li>
        </ul>
        <p class="t black ptb" v-if="$route.params.loanCode === '0202'">还款信息</p>
        <ul :class="$route.params.loanCode === '0201' ? 'mt' : ''">
            <li v-if="$route.params.loanCode === '0201'">
                <div class="row">
                    <div class="col-l">提现金额</div>
                    <div class="col-r red">{{amount | formatMoney}}元</div>
                </div>
            </li>
            <li v-if="$route.params.loanCode === '0202'">
  						<div class="row">
  							<div class="col-l">还款储蓄卡</div>
  							<div class="col-r">{{loanInfoQuery.infoMap.rpyBnakName}}</div>
  						</div>
  					</li>
            <li>
                <div class="row" @click="toggleDetailRate">
                    <div class="col-l">日费率</div>
                    <div class="col-r">
                        <div class="select">
                            <span class="select-text">{{loanInfoQuery.infoMap.rateSum | formatFloat}}%</span>
                            <span class="icon-sm icon-down"></span>
                        </div>
                    </div>
                </div>
                <div class="sprend" v-show="showDetailRate">
                    <p><span class="fr gray">{{loanInfoQuery.infoMap.rate | formatFloat}}%</span>日利率</p>
                    <div v-if="cgiMode">
                      <p><span class="fr gray">{{loanInfoQuery.infoMap.serviceCharge | formatFloat}}%</span>日服务费率</p>
                      <p><span class="fr gray">{{loanInfoQuery.infoMap.premium | formatFloat}}%</span>日保险费率</p>
                    </div>
                    <p v-else><span class="fr gray">{{loanInfoQuery.infoMap.guaranteeRate | formatFloat}}%</span>日担保费率</p>
                </div>
            </li>
            <li>
                <div class="row">
                    <div class="col-l">动用手续费</div>
                    <div class="col-r">{{counterFee | formatMoney}}元</div>
                </div>
            </li>
            <li>
                <div class="row">
                    <div class="col-l">还款方式</div>
                    <div class="col-r">等额本金</div>
                </div>
            </li>
            <li>
                <div class="row">
                    <div class="col-l">还款期数</div>
                    <div class="col-r">{{term}}期</div>
                </div>
            </li>
            <li>
                <div class="row">
                    <div class="col-l">还款日</div>
                    <div class="col-r">每月{{loanInfoQuery.infoMap.rpyDay}}日
                    </div>
                </div>
            </li>
            <li v-if="cgiMode">
                <div class="row">
                    <div class="col-l">贷款发放人</div>
                    <div class="col-r">普惠小贷{{loanInfoQuery.infoMap.cgiBankName ? '、' + loanInfoQuery.infoMap.cgiBankName : ''}}
                    <p class="t-sm" >{{loanInfoQuery.infoMap.cgiBankName ? "(以银行审批后显示为准)" : '' }}</p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'loanInfoHeader',
  data () {
    return {
      showDetailRate: false,
      creditCardName: ''
    }
  },
  // keep-alive组件激活时调用
  activated () {
    // 还卡流程确认借款页面一进来先获取信用卡信息
    this.getCreditCard()
  },
  computed: {
    ...mapGetters({
      getLogin: 'getLogin', // 获取登录信息
      getLoanAmt: 'getLoanAmt', // 获取借款金额
      getRepayCalculate: 'getRepayCalculate', // 还款试算接口
      getLoanInfoQuery: 'getLoanInfoQuery' // 借款查询接口
    }),
    loanInfoQuery () {
      return this.getLoanInfoQuery
    },
    cgiMode () {
      return this.getLoanInfoQuery.infoMap.fundingModel.toUpperCase() === 'U' || this.getLoanInfoQuery.infoMap.fundingModel.toUpperCase() === 'D'
    },
    // 借款金额
    amount () {
      return this.getLoanAmt
    },
    // 手续费
    counterFee () {
      return this.getRepayCalculate.counterFee
    },
    // 还款期数
    term () {
      return this.getRepayCalculate.term
    },
    // 银行编号
    loanBindNo () {
      return this.getLoanInfoQuery.infoMap.loanBindNo
    }
  },
  methods: {
    // 通过上个页面带过来或者已更新到store的loanBindNo,匹配出需要展示的银行卡名称
    getCreditCard () {
      // 还卡试算页面可以改信用卡,提现在确认信息页面才可以改卡,所以提现的直接从借款查询接口返回数据取
      if (this.$route.params.loanCode === '0202') {
        let creditCardList = this.loanInfoQuery.infoMap.creditCardList
        creditCardList.forEach((item) => {
          if (item.loanBindNo === this.loanBindNo) {
            this.creditCardName = item.cardName
          }
        })
      } else if (this.$route.params.loanCode === '0201') {
        this.creditCardName = this.getLoanInfoQuery.infoMap.creditCardName
      }
    },
    // 显示日费率详情
    toggleDetailRate () {
      this.showDetailRate = !this.showDetailRate
    },
    // 跳转到储蓄卡列表页
    goSelectCardPage () {
      if (this.$route.params.loanCode === '0201') {
        this.$router.push({
          name: 'selectCard'
        })
      }
    }
  }
}
</script>
<style>
  .noTopLine {
    border-top: 0px solid #d9d9d9 !important;
  }
</style>
