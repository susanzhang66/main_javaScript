import Axios from 'axios'
import Qs from 'qs'
import { BASE_URL, REQUEST_METHOD } from './urls'

// initial state
const state = {
  isLoading: false,
  response: {},
  commonParams: {
    os: String(window.navigator.platform).slice(0, 10),
    channelType: 'H5OUT'
  }
}

// getters
const getters = {
  isLoading: state => state.isLoading,
  getResponse: state => state.response
}

// actions
// Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。
const actions = {
  //{ state, commit } 参数解构，其实是一个函数，取其中的2个字段。 这个第一个参数 context..
  //第二个参数 { url, params, mutations }。也是对象参数解构。 其中mutations 这个是回调后的 数据，通过mutations修改数据。
  httpRequest: ({ state, commit }, { url, params, mutations }) => {
    return new Promise((resolve, reject) => {
      Object.assign(params, state.commonParams)
      commit('isLoading', true)
      Axios({
        url,
        data: Qs.stringify(params),
        method: REQUEST_METHOD,
        baseURL: BASE_URL,
        timeout: 60000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(({data}) => {
        commit('isLoading', false)
        commit('setResponse', data)
        if (data.flag === '1') {
          commit(mutations, data.data)
          resolve(data.data)
        }
      })
      .catch(() => {
        commit('isLoading', false)
        commit('setResponse', {
          flag: '2',
          msg: '网络异常，请稍后再试！'
        })
      })
    })
  }
}

// mutations
const mutations = {
  isLoading: (state, data) => {
    state.isLoading = data
  },
  setResponse: (state, data) => {
    state.response = data
  },
  setCommonParams: (state, data) => {
    Object.assign(state.commonParams, {
      accountId: data.accountId,
      token: data.token
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
