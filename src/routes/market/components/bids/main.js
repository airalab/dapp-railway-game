import React from 'react'
import { timeConverter } from '../../../../utils/helper'

const Main = props => (
  (<div className="panel panel-default">
    <div className="panel-body">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>price</th>
            <th>value</th>
            <th>stamp</th>
          </tr>
        </thead>
        <tbody>
          {props.bids.map((order, index) =>
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
