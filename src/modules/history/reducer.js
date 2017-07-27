import { SET_HISTORY } from './actionTypes'

const initialState = {
  items: [],
}

export default function history(state = initialState, action) {
  switch (action.type) {
    case SET_HISTORY: {
      return { ...state, items: action.payload }
    }

    default:
      return state;
  }
}
