import Promise from 'bluebird'
import _ from 'lodash'
import hett from 'hett'
import i18next from 'i18next'
import { actions as actionsForm } from 'vol4-form'
import { LOAD, MODULE, SET_ASKS_ORDERS, SET_BIDS_ORDERS, SET_LAST_PRICE } from './actionTypes'
import { flashMessage } from '../app/actions'
import { loadModule as loadModuleToken, loadApprove, loadBalance } from '../token/actions'
import { MARKET_DEFAULT_ADDR1, ORDER_CLOSED, ORDER_PARTIAL } from '../../config/config'
import { getLog, getPrice, getBlock } from '../../utils/helper'

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

export function setlastPrice(address, price) {
  return {
    type: SET_LAST_PRICE,
    payload: {
      address,
      price
    }
  }
}

const getOrder = (market, type, index) => {
  const orderInfo = {};
  return market.call(type, [index])
    .then((id) => {
      orderInfo.id = Number(id)
      return market.call('orders', [orderInfo.id])
    })
    .then((order) => {
      orderInfo.kind = Number(order[0]);
      orderInfo.agent = order[1];
      orderInfo.value = Number(order[2]);
      orderInfo.startValue = Number(order[3]);
      orderInfo.stamp = Number(order[4]);
      return market.call('priceOf', [orderInfo.id])
    })
    .then((priceOrder) => {
      orderInfo.price = Number(priceOrder);
      return orderInfo;
    })
}

export function loadAsks(address) {
  return (dispatch) => {
    dispatch(startLoad(address, 'isLoadAsks'))
    let market;
    hett.getContractByName('Market', address)
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
    hett.getContractByName('Market', address)
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

export function loadLastPrice(address) {
  return (dispatch) => {
    let log = []
    getLog(address, ORDER_CLOSED)
      .then((result) => {
        log = log.concat(result);
        return getLog(address, ORDER_PARTIAL)
      })
      .then((result) => {
        log = log.concat(result);
        const prices = [];
        _.forEach(log, (item) => {
          prices.push(getPrice(item.type, item.id));
        })
        return Promise.all(prices)
      })
      .then((prices) => {
        log = _.map(log, (item, i) => (
          {
            ...item,
            price: prices[i]
          }
        ))
      })
      .then(() => {
        const blocks = [];
        _.forEach(log, (item) => {
          blocks.push(getBlock(item.blockNumber));
        })
        return Promise.all(blocks)
      })
      .then((blocks) => {
        log = _.map(log, (item, i) => (
          {
            ...item,
            time: blocks[i]
          }
        ))
        log = _.orderBy(log, ['time', 'logIndex'], ['asc', 'desc']);
        const item = log.pop()
        dispatch(setlastPrice(address, item.price))
      })
  }
}

const isEvents = {};
export function events(address) {
  return (dispatch) => {
    if (_.has(isEvents, address)) {
      return;
    }
    isEvents[address] = true;
    hett.getContractByName('Market', address)
      .then((contract) => {
        contract.listen('OrderClosed', (result) => {
          const id = Number(result.order)
          contract.call('priceOf', [id])
            .then((price) => {
              dispatch(setlastPrice(address, Number(price)))
              dispatch(flashMessage(
                i18next.t('market:closeOrderPrice', { market: (MARKET_DEFAULT_ADDR1 === address ? 'A' : 'B'), price: Number(price) + ' AIR' }),
                'info',
                true
              ))
            })
        })
        contract.listen('OrderPartial', (result) => {
          const id = Number(result.order)
          contract.call('priceOf', [id])
            .then((price) => {
              dispatch(setlastPrice(address, Number(price)))
              dispatch(flashMessage(
                i18next.t('market:partialOrderPrice', { market: (MARKET_DEFAULT_ADDR1 === address ? 'A' : 'B'), price: Number(price) + ' AIR' }),
                'info',
                true
              ))
            })
        })
      })
  }
}

export function loadModule(address) {
  return (dispatch) => {
    dispatch(startLoad(address))
    hett.getContractByName('Market', address)
      .then(contract => (
        Promise.join(
          contract.call('name'),
          contract.call('base'),
          contract.call('quote'),
          contract.call('decimals'),
          (...info) => (
            {
              name: info[0],
              base: info[1],
              quote: info[2],
              decimals: Number(info[3]),
            }
          )
        )
      ))
      .then((info) => {
        dispatch(module({
          address,
          info
        }))
        dispatch(loadModuleToken(info.base))
        dispatch(loadModuleToken(info.quote))
        dispatch(loadApprove(info.base, address))
        dispatch(loadApprove(info.quote, address))
        dispatch(loadBalance(info.base, hett.web3h.coinbase()))
        dispatch(loadBalance(info.quote, hett.web3h.coinbase()))
        dispatch(loadAsks(address))
        dispatch(loadBids(address))
        hett.watcher.addAddress(info.base, 'loadTokenBase' + address, (base, params) => {
          dispatch(loadApprove(base, params.market))
          dispatch(loadBalance(base, hett.web3h.coinbase()))
        }, { market: address })
        hett.watcher.addAddress(info.quote, 'loadTokenQuote' + address, (quote, params) => {
          dispatch(loadApprove(quote, params.market))
          dispatch(loadBalance(quote, hett.web3h.coinbase()))
        }, { market: address })
        hett.watcher.addAddress(address, 'loadMarket' + address, (market, params) => {
          dispatch(loadAsks(market))
          dispatch(loadBids(market))
          dispatch(loadApprove(params.base, market))
          dispatch(loadApprove(params.quote, market))
          dispatch(loadBalance(params.base, hett.web3h.coinbase()))
          dispatch(loadBalance(params.quote, hett.web3h.coinbase()))
        }, { base: info.base, quote: info.quote })
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
    dispatch(contractSend('Market', address, action, data))
  )
}

export function orderLimit(address, data, formId) {
  return (dispatch) => {
    dispatch(actionsForm.start(formId));
    dispatch(send(address, 'orderLimit', data))
      .then(() => {
        dispatch(actionsForm.stop(formId));
        dispatch(actionsForm.success(formId, i18next.t('market:newLotSuccess')));
        dispatch(actionsForm.reset(formId));
        setTimeout(() => {
          dispatch(actionsForm.success(formId, ''));
        }, 4000)
      })
      .catch((e) => {
        console.log(e);
        return Promise.reject();
      })
  }
}

export function orderMarket(address, data, formId) {
  return (dispatch) => {
    dispatch(actionsForm.start(formId));
    dispatch(send(address, 'orderMarket', data))
      .then(() => {
        dispatch(actionsForm.stop(formId));
        dispatch(actionsForm.success(formId, i18next.t('market:opSuccess')));
        dispatch(actionsForm.reset(formId));
        setTimeout(() => {
          dispatch(actionsForm.success(formId, ''));
        }, 4000)
      })
      .catch((e) => {
        console.log(e);
        return Promise.reject();
      })
  }
}
