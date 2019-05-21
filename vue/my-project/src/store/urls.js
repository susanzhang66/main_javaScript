let baseURL = ''
let requestMethod = 'post'

process.env.SS_ENV = 'DEV'
console.log(process.env.SS_ENV)
switch (process.env.SS_ENV) {
  case 'DEV':
    baseURL = '/mockData'
    requestMethod = 'get'
    break
  case 'TEST':
    baseURL = 'http://10.184.152.67:7001/cfsssfront'
    break
  case 'STG1':
    baseURL = 'https://test1-cfs-phone-web.pingan.com.cn/cfsssfront'
    break
  case 'STG2':
    baseURL = 'https://test2-cfs-phone-web.pingan.com.cn/cfsssfront'
    break
  case 'STG3':
    baseURL = 'https://test3-cfs-phone-web.pingan.com.cn/cfsssfront'
    break
  case 'STG4':
    baseURL = 'https://test4-cfs-phone-web.pingan.com.cn:16443/cfsssfront'
    break
  case 'STG5':
    baseURL = 'https://test5-cfs-phone-web.pingan.com.cn:34081/cfsssfront'
    break
  default:
    baseURL = '/mockData'
    requestMethod = 'get'
}

export const BASE_URL = baseURL
export const REQUEST_METHOD = requestMethod
// 获取图片验证码
export const GET_PIC_CODE = '/um/h5login/getPicCode.do'
// 获取H5登录OTP
export const GET_SMS_CODE = '/um/h5login/getSMSCode.do'
// H5校验OTP接口
export const CHECK_OTP = '/um/h5login/checkOTP.do'
// H5登录身份校验接口
export const VERIFY_IDENTITY = '/um/h5login/verifyIdentityInfo.do'
// I贷入口查询接口
export const QUERY_ILOAN_STATE = '/iloan/queryIloanState.do'
// getUserInfo返回数据
export const USER_INFO_DATA = '/iloan/userInfoData.do'
// 申请状态查询接口
export const QUERY_USER_APPLY_STATE = '/iloan/queryUserApplyState.do'
// 选择产品接口
export const QUERY_PRODUCT = '/iloan/queryProduct.do'
// 电子签名接口
export const ELECTRONIC_SIGNATURE = '/bt/bTuploadPosElectronicSignature.do'
// 变更银行接口
export const BANK_ALTER = '/iloan/bank/alter.do'
// 借款查询接口
export const QUERY_ILOAN_CREDIT_AMT = 'iloan/queryIloanCreditAmt.do'
// 获取补录身份信息接口
export const OTHER_CUSTOMER_INFO = 'common/getOtherCustomerInfo.do'
// 补录身份信息
export const APPEND_OTHER_CUSTOMER_INFO = 'common/appendOtherCustomerInfo.do'
// 还款试算接口
export const REPAYMENT_CALCULATE = '/iloan/repayCalc.do'
// 信用卡银联认证接口
export const CREDITCARDUNIONPAYCERTIFICATION = '/icard/creditCardUnionPayCertification.do'
// 获取H5链接接口
export const GET_INSURANCE_H5_LINK = '/iloan/getinsuranceH5Liank.do'
// 通知核保接口
export const ADVISE_UNDER_WRITING = '/iloan/adviseUnderWriting.do'
// 再贷借款接口
export const COMMIT_SIGN_APPL = '/iloan/commitSignAppl.do'
// 还卡选择产品，获取支用申请号
export const CHOOSEPRODECT = '/icard/rpy/chooseProduct.do'
// 设置还款日期接口
export const SETGIVEBACKDATE = '/icard/setRemindDay.do'
// 还款列表
export const QUERY_ALL_REPAYMENT = '/icard/rpy/queryAllRepayment.do'
// 还款历史
export const ALREADY_RPY_LIST = '/icard/rpy/alreadyRpyList.do'
// 还款计划
export const RPY_PLAN = '/icard/rpy/rpyPlan.do'
// 当前还款明细
export const QUERY_REPAYMENT = '/icard/rpy/queryRepayment.do'
// 更改默认借记卡接口
export const CHANGE_LOANCARD = '/icard/rpy/changeTolerantLoanCard.do'
// 贷款详情
export const LOAN_DETAIL = '/icard/rpy/loanDetail.do'
// 还款确认
export const SUBMIT_RPY = '/icard/rpy/submitRpy.do'
// 还款金额提交试算接口
export const REPAY_SUBMIT_TRY = '/iloan/aheadOfTimeRepayCalc.do'
