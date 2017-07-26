import { SET_ROLE, SET_LANGUAGE } from './actionTypes'

const initialState = {
  title: 'Игра “Робономика: управляй поездом”',
  role: '',
  language: 'en'
}

export default function app(state = initialState, action) {
  switch (action.type) {
    case SET_ROLE:
      return { ...state, role: action.payload }

    case SET_LANGUAGE:
      return { ...state, language: action.payload }

    default:
      return state;
  }
}
