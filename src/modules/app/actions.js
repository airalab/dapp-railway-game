import Notifications from 'react-notification-system-redux';
import i18next from 'i18next'
import { Cookies } from 'react-cookie'
import { SET_LANGUAGE } from './actionTypes'

const cookies = new Cookies();

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

export function setLanguage(language) {
  i18next.changeLanguage(language)
  cookies.set('language', language);
  return {
    type: SET_LANGUAGE,
    payload: language
  }
}
