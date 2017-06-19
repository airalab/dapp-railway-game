import React from 'react'
import { Link } from 'react-router'

// <div className="collapse navbar-collapse" id="navcol-1">
//   <ul className="nav navbar-nav navbar-right">
//     <li role="presentation"><Link to="/market-liability">market liability</Link></li>
//     <li role="presentation"><Link to="/estimator">estimator</Link></li>
//   </ul>
// </div>
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
      </div>
    </nav>
  )
}

export default Header
