import React from 'react'
import { Link } from 'react-router'
import _ from 'lodash'

const Header = function Header(props) {
  return (
    <nav className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <Link to="/" className="navbar-brand navbar-link">
            <img src="assets/img/aira-logo.svg" className="navbar-brand-img d-ib-mid" alt="" />
            <span className="d-ib-mid">{props.title}</span>
          </Link>
        </div>
        <ul className="nav navbar-nav navbar-right">
          <li className="dropdown">
            <a className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false" href="">
              {_.upperFirst(props.language)} <span className="caret" />
            </a>
            <ul className="dropdown-menu" role="menu">
              <li className={(props.language === 'en') ? 'disabled' : ''} role="presentation">
                <a href="" onClick={(e) => { e.preventDefault(); props.setLanguage('en'); }}>English</a>
              </li>
              <li className={(props.language === 'ru') ? 'disabled' : ''} role="presentation">
                <a href="" onClick={(e) => { e.preventDefault(); props.setLanguage('ru'); }}>Русский</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Header
