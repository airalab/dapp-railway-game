import Promise from 'bluebird'
import _ from 'lodash'
import hett from 'hett'
import { LOAD, MODULE, SET_ASKS_ORDERS, SET_BIDS_ORDERS } from './actionTypes'
import { flashMessage } from '../app/actions'
import { loadApprove } from '../token/actions'
import { TOKEN_ADDR_AIR } from '../../config/config'

export function module(info) {
  return {
    type: MODULE,
    payload: info
  }
}

export function startLoad(address, type = 'isLoad') {
  return {
    type: LOAD,
    payload: {
      address,
      type
    }
  }
}

export function setAsks(address, orders) {
  return {
    type: SET_ASKS_ORDERS,
    payload: {
      address,
      orders
    }
  }
}

export function setBids(address, orders) {
  return {
    type: SET_BIDS_ORDERS,
    payload: {
      address,
      orders
    }
  }
}

const getOrder = (market, type, index) => {
  const orderInfo = {
    type
  };
  return market.call(type, [index])
    .then((id) => {
      orderInfo.id = Number(id)
      if (orderInfo.id > 0) {
        return market.call('getOrder', [orderInfo.id])
      }
      return false;
    })
    .then((order) => {
      if (order !== false && !order[3]) {
        orderInfo.beneficiary = order[0];
        orderInfo.promisee = order[1];
        orderInfo.promisor = order[2];
        orderInfo.closed = order[3];
        return market.call('priceOf', [orderInfo.id])
      }
      return false;
    })
    .then((priceOrder) => {
      if (priceOrder) {
        orderInfo.price = Number(priceOrder);
      }
    })
    .then(() => {
      if (_.has(orderInfo, 'id')) {
        return orderInfo;
      }
      return false;
    })
}

export function loadAsks(address) {
  return (dispatch) => {
    dispatch(startLoad(address, 'isLoadAsks'))
    let market;
    hett.getContractByName('AiraMarket', address)
      .then((contract) => {
        market = contract;
        return market.call('asksLength')
      })
      .then((length) => {
        const orders = [];
        for (let i = 0; i < Number(length) && i <= 14; i += 1) {
          orders.push(getOrder(market, 'asks', i));
        }
        return Promise.all(orders)
      })
      .then((orders) => {
        dispatch(setAsks(address, orders))
      })
  }
}

export function loadBids(address) {
  return (dispatch) => {
    dispatch(startLoad(address, 'isLoadBids'))
    let market;
    hett.getContractByName('AiraMarket', address)
      .then((contract) => {
        market = contract;
        return market.call('bidsLength')
      })
      .then((length) => {
        const orders = [];
        for (let i = 0; i < Number(length) && i <= 14; i += 1) {
          orders.push(getOrder(market, 'bids', i));
        }
        return Promise.all(orders)
      })
      .then((orders) => {
        dispatch(setBids(address, orders))
      })
  }
}

export function loadModule(address) {
  return (dispatch) => {
    dispatch(startLoad(address))
    hett.getContractByName('AiraMarket', address)
      .then(contract => (
        Promise.join(
          contract.call('name'),
          contract.call('taxman'),
          contract.call('comission'),
          (...info) => (
            {
              name: info[0],
              taxman: info[1],
              comission: Number(info[2]),
            }
          )
        )
      ))
      .then((info) => {
        dispatch(module({
          address,
          info
        }))
        dispatch(loadApprove(TOKEN_ADDR_AIR, address))
        dispatch(loadAsks(address))
        dispatch(loadBids(address))
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
    dispatch(contractSend('AiraMarket', address, action, data))
  }
}
