import React from 'react'

const Main = props => (
  (<div className="panel panel-default">
    <div className="panel-body">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>price</th>
            <th>beneficiary</th>
            <th>promisee</th>
            <th>name</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {props.bids.map((order, index) =>
            <tr key={index}>
              <td><span className="price">{order.price} Air</span></td>
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
              <td>
                {props.approve >= order.price ?
                  <button className="btn btn-default btn-xs" onClick={() => props.onBuy(props.market, order.id)}>
                    <span className="fa fa-chevron-down" />
                  </button>
                  :
                  <button
                    className="btn btn-warning btn-xs"
                    onClick={() => props.onApprove(
                      props.market,
                      props.token,
                      order.price - props.approve
                    )}
                  >
                    Add to approve {order.price - props.approve} Air
                  </button>
                }
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>)
)

export default Main
