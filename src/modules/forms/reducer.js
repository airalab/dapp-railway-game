import _ from 'lodash'
import { ADD, RESET, MESSAGE } from './actionTypes'

const initialState = {
  items: {}
}

export default function forms(state = initialState, action) {
  switch (action.type) {
    case ADD: {
      const items = { ...state.items }
      if (!_.has(items, action.payload)) {
        items[action.payload] = {
          reset: false,
          message: ''
        }
      }
      return { ...state, items: { ...items } }
    }

    case RESET: {
      const items = { ...state.items }
      if (_.has(items, action.payload.id)) {
        items[action.payload.id] = {
          ...items[action.payload.id],
          reset: action.payload.bool
        }
      }
      return { ...state, items: { ...items } }
    }

    case MESSAGE: {
      const items = { ...state.items }
      if (_.has(items, action.payload.id)) {
        items[action.payload.id] = {
          ...items[action.payload.id],
          message: action.payload.msg
        }
      }
      return { ...state, items: { ...items } }
    }

    default:
      return state;
  }
}
