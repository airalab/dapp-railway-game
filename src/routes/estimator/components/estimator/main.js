import React from 'react'
import _ from 'lodash'
import Buy from '../../containers/buy'

const Main = props => (
  (<div>
    <h3>{props.address} - totalEstimation: {props.info.totalEstimation}</h3>
    <p>startTime: <b>{props.info.startTime}</b></p>
    <p>estimationPeriod: <b>{props.info.estimationPeriod}</b></p>
    <p>metrics: <b>{props.info.metrics}</b> (balance: <b>{(_.has(props, 'metrics')) ? props.metrics : 0}</b>)</p>
    <p>air: <b>{props.info.air}</b> (balance: <b>{(_.has(props, 'air')) ? props.air : 0}</b>)</p>
    <p>airaMarket: <b>{props.info.airaMarket}</b></p>
    <p>visionaryFee: <b>{props.info.visionaryFee}</b></p>
    <p>investorsFee: <b>{props.info.investorsFee}</b></p>
    <p>metricsPrice: <b>{props.info.metricsPrice}</b></p>
    <Buy address={props.address} />
  </div>)
)

export default Main
