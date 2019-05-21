import agreement from '@/components/account/agreement'
import contract from '@/components/account/contract'
// https://doc.webpack-china.org/api/module-methods/#require-ensure
const borrowIndex = r => require.ensure([], () => r(require('@/components/borrow')), 'group-borrow')
const borrow = r => require.ensure([], () => r(require('@/components/borrow/borrow')), 'group-borrow')
const loanRepayPlan = r => require.ensure([], () => r(require('@/components/borrow/borrow-loanRepayPlan')), 'group-borrow')
// const selectCard = r => require.ensure([], () => r(require('@/components/borrow/borrow-selectCard')), 'group-borrow')
// const identityRecord = r => require.ensure([], () => r(require('@/components/borrow/loanApply-identityRecord')), 'group-borrow')
// const productDetail = r => require.ensure([], () => r(require('@/components/borrow/productDetail')), 'group-borrow')
// const creditFailResult = r => require.ensure([], () => r(require('@/components/borrow/creditFailResult')), 'group-borrow')
const loanInfo = r => require.ensure([], () => r(require('@/components/borrow/loanInfo')), 'group-borrow')
// const intro = r => require.ensure([], () => r(require('@/components/borrow/intro')), 'group-borrow')
const loanResult = r => require.ensure([], () => r(require('@/components/borrow/loanResult')), 'group-borrow')

export default {
  path: '/borrow/:loanCode',
  component: borrowIndex,
  children: [
    {
      path: '',
      name: 'borrow',
      component: borrow
    },
    // {
    //   path: 'identityRecord',
    //   name: 'identityRecord',
    //   component: identityRecord
    // },
    // {
    //   path: 'productDetail',
    //   name: 'productDetail',
    //   component: productDetail
    // },
    // {
    //   path: 'creditFailResult',
    //   name: 'creditFailResult',
    //   component: creditFailResult
    // },
    {
      path: 'loanRepayPlan',
      name: 'loanRepayPlan',
      component: loanRepayPlan
    },
    // {
    //   path: 'selectCard',
    //   name: 'selectCard',
    //   component: selectCard
    // },
    {
      path: 'loanInfo',
      name: 'loanInfo',
      component: loanInfo
    },
    // {
    //   path: 'intro',
    //   name: 'intro',
    //   component: intro
    // },
    // {
    //   path: 'agreement',
    //   name: 'agreementLoanInfo',
    //   component: agreement
    // },
    // {
    //   path: 'contract',
    //   name: 'contractLoanInfo',
    //   component: contract
    // },
    {
      path: '/loanResult/:loanCode/:loanResult',
      name: 'loanResult',
      component: loanResult
    }
  ]
}
