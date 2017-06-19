import React from 'react'
import EthLink from '../../../../shared/components/common/ethLink';

const Main = props => (
  (<div className="panel panel-default">
    <div className="panel-body">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>price</th>
            <th>agent</th>
            <th>value</th>
            <th>startValue</th>
            <th>stamp</th>
          </tr>
        </thead>
        <tbody>
          {props.bids.map((order, index) =>
            <tr key={index}>
              <td>{order.price}</td>
              <td><EthLink address={order.agent} /></td>
              <td>{order.value}</td>
              <td>{order.startValue}</td>
              <td>{order.stamp}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>)
)

export default Main
