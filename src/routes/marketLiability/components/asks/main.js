import React from 'react'

const Main = props => (
  (<div className="panel panel-default">
    <div className="panel-body">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>price</th>
            <th>promisor</th>
            <th>beneficiary</th>
            <th>promisee</th>
            <th>name</th>
          </tr>
        </thead>
        <tbody>
          {props.asks.map((order, index) =>
            <tr key={index}>
              <td><span className="price">{order.price} Air</span></td>
              <td>{order.promisor}</td>
              <td>
                <ul>
                  {order.beneficiary.map((address, index2) =>
                    <li key={index2}>
                      {address}
                    </li>
                  )}
                </ul>
              </td>
              <td>
                <ul>
                  {order.promisee.map((address, index2) =>
                    <li key={index2}>
                      {address}
                    </li>
                  )}
                </ul>
              </td>
              <td>
                <ul>
                  {order.promisee.map((address, index2) =>
                    <li key={index2}>
                      {address}
                    </li>
                  )}
                </ul>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>)
)

export default Main
