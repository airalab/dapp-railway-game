import React from 'react'
import i18next from 'i18next'
import { timeConverter } from '../../../../utils/helper'

const Main = props => (
  (<div className="panel panel-default">
    <div className="panel-body">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>{i18next.t('market:price')}</th>
            <th>{i18next.t('market:value')}</th>
            <th>{i18next.t('market:time')}</th>
          </tr>
        </thead>
        <tbody>
          {props.asks.map((order, index) =>
            <tr key={index}>
              <td>{order.price}</td>
              <td>{order.value}</td>
              <td>{timeConverter(order.stamp)}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>)
)

export default Main
