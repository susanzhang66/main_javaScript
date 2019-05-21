import { ELECTRONIC_SIGNATURE } from './urls'

// initial state
const state = {
  signature: {}
}

// getters
const getters = {
  getSignature: state => state.signature
}

// actions
const actions = {
  signature: ({ state, dispatch }) => {
    return dispatch('httpRequest', {
      url: ELECTRONIC_SIGNATURE,
      params: state.signatureParams,
      mutations: 'setPicCode'
    })
  }
}

// mutations
const mutations = {
  setSignature: (state, data) => {
    state.signature = data
  },
  setSignParams: (state, data) => {
    const key = data.paramsKey
    delete data.paramsKey
    if (!state[key]) {
      state[key] = {}
    }
    Object.assign(state[key], data)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
