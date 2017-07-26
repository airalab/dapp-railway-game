import Promise from 'bluebird'
import hett from 'hett'
import { START_LOAD, MODULE, BALACE, APPROVE } from './actionTypes'
import { formatDecimals } from '../../utils/helper'
import { flashMessage } from '../app/actions'
import { reset as formReset, message as formMessage } from '../forms/actions'

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

export function setBalance(info) {
  return {
    type: BALACE,
    payload: info
  }
}

export function setApprove(info) {
  return {
    type: APPROVE,
    payload: info
  }
}

export function loadBalance(address, to) {
  return (dispatch) => {
    dispatch(startLoad(address))
    hett.getContractByName('Token', address)
      .then(contract => (
        Promise.join(
          contract.call('balanceOf', [to]),
          contract.call('decimals'),
          (balance, decimals) => (
            {
              balance: formatDecimals(balance, decimals),
            }
          )
        )
      ))
      .then((info) => {
        dispatch(setBalance({
          address,
          to,
          balance: info.balance
        }))
      })
  }
}

export function loadApprove(address, to) {
  return (dispatch) => {
    dispatch(startLoad(address))
    hett.getContractByName('Token', address)
      .then(contract => (
        Promise.join(
          contract.call('allowance', [hett.web3h.coinbase(), to]),
          contract.call('decimals'),
          (allowance, decimals) => (
            {
              approve: formatDecimals(allowance, decimals)
            }
          )
        )
      ))
      .then((info) => {
        dispatch(setApprove({
          address,
          to,
          approve: info.approve
        }))
      })
  }
}

export function loadModule(address) {
  return (dispatch) => {
    dispatch(startLoad(address))
    hett.getContractByName('Token', address)
      .then(contract => (
        Promise.join(
          contract.call('name'),
          contract.call('symbol'),
          (...info) => {
            let name = info[0]
            if (info[0] === 'My Robometrics') {
              name = 'FUTURES A';
            } else if (info[0] === 'My Robometrics2') {
              name = 'FUTURES B';
            }
            let symbol = info[1]
            if (info[1] === 'MRM') {
              symbol = 'FUTURES A';
            } else if (info[1] === 'MR2') {
              symbol = 'FUTURES B';
            }
            return {
              name,
              symbol
            }
          }
        )
      ))
      .then((info) => {
        dispatch(module({
          address,
          info
        }))
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
  return dispatch => (
    dispatch(contractSend('Token', address, action, data))
  )
}

export function approve(address, data, formId) {
  return (dispatch) => {
    dispatch(send(address, 'approve', data))
      .then(() => {
        dispatch(formReset(formId))
        dispatch(formMessage(formId, 'Новый лимит установлен'))
      })
      .catch((e) => {
        console.log(e);
        return Promise.reject();
      })
  }
}
