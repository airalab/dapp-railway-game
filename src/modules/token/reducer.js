import _ from 'lodash'
import { START_LOAD, MODULE, BALACE, APPROVE } from './actionTypes'

const initialState = {
  modules: {}
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
      if (_.has(modules, action.payload.address)) {
        modules[action.payload.address] = {
          ...modules[action.payload.address],
          info: { ...action.payload.info },
          isLoad: false
        }
      } else {
        modules[action.payload.address] = {
          address: action.payload.address,
          info: { ...action.payload.info },
          isLoad: false,
          balance: {},
          approve: {},
        }
      }
      return { ...state, modules: { ...modules } }
    }

    case BALACE: {
      const modules = { ...state.modules }
      if (_.has(modules, action.payload.address)) {
        modules[action.payload.address] = {
          ...modules[action.payload.address],
          balance: {
            ...modules[action.payload.address].balance,
            [action.payload.to]: action.payload.balance
          },
          isLoad: false
        }
      } else {
        modules[action.payload.address] = {
          address: action.payload.address,
          balance: {
            [action.payload.to]: action.payload.balance
          },
          isLoad: false
        }
      }
      return { ...state, modules: { ...modules } }
    }

    case APPROVE: {
      const modules = { ...state.modules }
      if (_.has(modules, action.payload.address)) {
        modules[action.payload.address] = {
          ...modules[action.payload.address],
          approve: {
            ...modules[action.payload.address].approve,
            [action.payload.to]: action.payload.approve
          },
          isLoad: false
        }
      } else {
        modules[action.payload.address] = {
          address: action.payload.address,
          approve: {
            [action.payload.to]: action.payload.approve
          },
          isLoad: false
        }
      }
      return { ...state, modules: { ...modules } }
    }

    default:
      return state;
  }
}
