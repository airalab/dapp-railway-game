import _ from 'lodash'
import { LOAD, MODULE, SET_ASKS_ORDERS, SET_BIDS_ORDERS, SET_LAST_PRICE } from './actionTypes'

const initialState = {
  modules: {},
}

export default function estimator(state = initialState, action) {
  switch (action.type) {
    case LOAD: {
      const modules = { ...state.modules }
      if (_.has(modules, action.payload.address)) {
        modules[action.payload.address] = {
          ...modules[action.payload.address],
          [action.payload.type]: true
        }
      } else {
        modules[action.payload.address] = {
          address: action.payload.address,
          [action.payload.type]: true
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
          asks: {},
          bids: {},
          isLoad: false,
          lastPrice: 0
        }
      }
      return { ...state, modules: { ...modules } }
    }

    case SET_ASKS_ORDERS: {
      const modules = { ...state.modules }
      if (_.has(modules, action.payload.address)) {
        modules[action.payload.address] = {
          ...modules[action.payload.address],
          asks: action.payload.orders,
          isLoadAsks: false
        }
      } else {
        console.log('not found module market');
      }
      return { ...state, modules: { ...modules } }
    }

    case SET_BIDS_ORDERS: {
      const modules = { ...state.modules }
      if (_.has(modules, action.payload.address)) {
        modules[action.payload.address] = {
          ...modules[action.payload.address],
          bids: action.payload.orders,
          isLoadBids: false
        }
      } else {
        console.log('not found module market');
      }
      return { ...state, modules: { ...modules } }
    }

    case SET_LAST_PRICE: {
      const modules = { ...state.modules }
      if (_.has(modules, action.payload.address)) {
        modules[action.payload.address] = {
          ...modules[action.payload.address],
          lastPrice: action.payload.price
        }
      } else {
        modules[action.payload.address] = {
          address: action.payload.address,
          lastPrice: action.payload.price
        }
      }
      return { ...state, modules: { ...modules } }
    }

    default:
      return state;
  }
}
