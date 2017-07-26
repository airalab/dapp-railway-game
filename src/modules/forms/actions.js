import { ADD, RESET, MESSAGE } from './actionTypes'

export function add(id) {
  return {
    type: ADD,
    payload: id
  }
}

export function reset(id, bool = true) {
  return {
    type: RESET,
    payload: {
      id,
      bool
    }
  }
}

export function setMessage(id, msg) {
  return {
    type: MESSAGE,
    payload: {
      id,
      msg
    }
  }
}

export function message(id, msg) {
  return (dispatch) => {
    dispatch(setMessage(id, msg))
    setTimeout(() => {
      dispatch(setMessage(id, ''))
    }, 3000)
  }
}
