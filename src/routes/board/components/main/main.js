import React from 'react'
import { Link } from 'react-router'
import { translate } from 'react-i18next'

const Main = props => (
  <div className="row">
    <div className="col-md-6">
      <div className={props.style1}>
        <div className="panel-body">
          <h1>Circle-market A</h1>
          <div className="text-center" style={{ fontSize: 20, marginBottom: 15 }}>
            {props.t('lastPrice')}:<br />
            <b>{props.price1} {props.quote1.info.symbol}</b> / {props.t('futures')}
          </div>
          <div className="text-center">
            <Link to={'/market/' + props.address1} className="btn btn-info">{props.t('showMarket')}</Link>
          </div>
        </div>
      </div>
    </div>
    <div className="col-md-6">
      <div className={props.style2}>
        <div className="panel-body">
          <h1>Circle-market B</h1>
          <div className="text-center" style={{ fontSize: 20, marginBottom: 15 }}>
            {props.t('lastPrice')}:<br />
            <b>{props.price2} {props.quote2.info.symbol}</b> / {props.t('futures')}
          </div>
          <div className="text-center">
            <Link to={'/market/' + props.address2} className="btn btn-info">{props.t('showMarket')}</Link>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default translate(['board'])(Main)
