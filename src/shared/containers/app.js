import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Cookies } from 'react-cookie'
import Notifications from 'react-notification-system-redux';
import i18next from 'i18next'

import Header from '../components/app/header'
import Footer from '../components/app/footer'
import { flashMessage, setLanguage } from '../../modules/app/actions';

import './style.css'

class App extends Component {
  componentWillMount() {
    const cookies = new Cookies();
    const language = cookies.get('language')
    if (language) {
      this.props.setLanguage(language)
    }
  }

  render() {
    const style = {
      Containers: {
        DefaultStyle: {
          width: '530px',
        }
      },
      NotificationItem: {
        DefaultStyle: {
          margin: '10px 5px 2px 1px'
        },
      }
    };
    return (<div>
      <Header
        title={this.props.title}
        language={this.props.language}
        setLanguage={this.props.setLanguage}
      />
      <div className="container" id="maincontainer">
        {this.props.children}
      </div>
      <Footer />
      <Notifications
        notifications={this.props.notifications}
        style={style}
        allowHTML
      />
    </div>)
  }
}

function mapStateToProps(state) {
  return {
    title: i18next.t('appTitle'),
    language: state.app.language,
    notifications: state.notifications,
  }
}
function mapDispatchToProps(dispatch) {
  const actions = bindActionCreators({
    flashMessage,
    setLanguage,
  }, dispatch)
  return {
    flashMessage: actions.flashMessage,
    setLanguage: actions.setLanguage,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
