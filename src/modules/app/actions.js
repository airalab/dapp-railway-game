import Notifications from 'react-notification-system-redux';
import i18next from 'i18next'
import { SET_ROLE, SET_LANGUAGE } from './actionTypes'

export function flashMessage(message, type = 'info', isSave = false) {
  return (dispatch) => {
    const notificationOpts = {
      // title: 'Hey, it\'s good to see you!',
      message,
      position: 'tr',
      autoDismiss: 10
    };
    if (type === 'error') {
      dispatch(Notifications.error(notificationOpts))
    } else {
      dispatch(Notifications.info(notificationOpts))
    }
    if (isSave) {
      console.log(message);
    }
  }
}

export function setRole(role) {
  return {
    type: SET_ROLE,
    payload: role
  }
}

export function setLanguage(language) {
  i18next.changeLanguage(language)
  return {
    type: SET_LANGUAGE,
    payload: language
  }
}
