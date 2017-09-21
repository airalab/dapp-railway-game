import React from 'react'
import i18next from 'i18next'
import Add from '../../containers/addBuy';

const Main = props => (
  <div className="panel panel-default">
    <div className="panel-heading"><h4 className="panel-title">{i18next.t('market:buy')}</h4></div>
    <div className="panel-body">
      <Add address={props.address} />
    </div>
  </div>
)

export default Main
