import Promise from 'bluebird'
import hett from 'hett'
import { START_LOAD, MODULE } from './actionTypes'
import { flashMessage } from '../app/actions'
import { loadApprove, loadBalance } from '../token/actions'

export function module(info) {
  return {
    type: MODULE,
    payload: info
  }
}

export function startLoad(address) {
  return {
    type: START_LOAD,
    payload: address
  }
}

export function loadModule(address) {
  return (dispatch) => {
    dispatch(startLoad(address))
    hett.getContractByName('AiraEstimator', address)
      .then(contract => (
        Promise.join(
          contract.call('startTime'),
          contract.call('estimationPeriod'),
          contract.call('metrics'),
          contract.call('air'),
          contract.call('airaMarket'),
          contract.call('visionaryFee'),
          contract.call('totalEstimation'),
          contract.call('investorsFee'),
          contract.call('metricsPrice'),
          // contract.call('metricsMarket'),
          (...info) => (
            {
              startTime: Number(info[0]),
              estimationPeriod: Number(info[1]),
              metrics: info[2],
              air: info[3],
              airaMarket: info[4],
              visionaryFee: Number(info[5]),
              totalEstimation: Number(info[6]),
              investorsFee: Number(info[7]),
              metricsPrice: Number(info[8]),
              // metricsMarket: info[9],
            }
          )
        )
      ))
      .then((info) => {
        dispatch(module({
          address,
          info
        }))
        dispatch(loadBalance(info.air, address))
        dispatch(loadBalance(info.metrics, address))
        dispatch(loadApprove(info.air, address))
        dispatch(loadApprove(info.metrics, address))
      })
  }
}

export function contractSend(abi, address, action, values) {
  return dispatch => (
    hett.getContractByName(abi, address)
      .then(contract => contract.send(action, values))
      .then((txId) => {
        dispatch(flashMessage('txId: ' + txId))
        return hett.watcher.addTx(txId)
      })
      .then((transaction) => {
        dispatch(flashMessage('blockNumber: ' + transaction.blockNumber))
        return transaction;
      })
      .catch((e) => {
        console.log(e);
        return Promise.reject();
      })
  )
}

export function send(address, action, data) {
  return (dispatch) => {
    dispatch(contractSend('Market', address, action, data))
  }
}
