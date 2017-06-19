import _ from 'lodash'
import { START_LOAD, MODULE, TOKEN_BALACE, TOKEN_APPROVE } from './actionTypes'

const initialState = {
  modules: {},
  tokens: {}
}

export default function estimator(state = initialState, action) {
  switch (action.type) {
    case START_LOAD: {
      const modules = { ...state.modules }
      if (_.has(modules, action.payload)) {
        modules[action.payload] = {
          ...modules[action.payload],
          isLoad: true
        }
      } else {
        modules[action.payload] = {
          address: action.payload,
          isLoad: true
        }
      }
      return { ...state, modules: { ...modules } }
    }

    case MODULE: {
      const modules = { ...state.modules }
      modules[action.payload.address] = {
        address: action.payload.address,
        info: { ...action.payload.info },
        isLoad: false
      }
      return { ...state, modules: { ...modules } }
    }

    case TOKEN_BALACE: {
      const tokens = { ...state.tokens }
      if (_.has(tokens, action.payload.address)) {
        tokens[action.payload.address] = {
          ...tokens[action.payload.address],
          balance: {
            ...tokens[action.payload.address].balance,
            [action.payload.to]: action.payload.balance
          }
        }
      } else {
        tokens[action.payload.address] = {
          address: action.payload.address,
          info: {},
          balance: {
            [action.payload.to]: action.payload.balance
          }
        }
      }
      return { ...state, tokens: { ...tokens } }
    }

    case TOKEN_APPROVE: {
      const tokens = { ...state.tokens }
      if (_.has(tokens, action.payload.address)) {
        tokens[action.payload.address] = {
          ...tokens[action.payload.address],
          approve: {
            ...tokens[action.payload.address].approve,
            [action.payload.to]: action.payload.approve
          }
        }
      } else {
        tokens[action.payload.address] = {
          address: action.payload.address,
          info: {},
          approve: {
            [action.payload.to]: action.payload.approve
          }
        }
      }
      return { ...state, tokens: { ...tokens } }
    }

    default:
      return state;
  }
}
