import Promise from 'bluebird'
import _ from 'lodash'
import hett from 'hett'
import i18next from 'i18next'
import { actions as actionsForm } from 'vol4-form'
import { LOAD, MODULE, SET_ASKS_ORDERS, SET_BIDS_ORDERS, SET_LAST_PRICE } from './actionTypes'
import { flashMessage } from '../app/actions'
import { loadModule as loadModuleToken, loadApprove, loadBalance } from '../token/actions'
import { load as loadHistory } from '../history/actions'
import { MARKET_DEFAULT_ADDR1, MARKET_DEFAULT_ADDR2, ORDER_CLOSED, ORDER_PARTIAL } from '../../config/config'
import { getLog, getPrice, getBlock, promiseFor } from '../../utils/helper'
import popup from '../../shared/components/app/popup'
import confirmSwitch from '../../shared/components/app/confirmSwitch'

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
        log = _.orderBy(log, ['time', 'logIndex'], ['asc', 'asc']);
        const item = log.pop()
        if (_.has(item, 'price')) {
          dispatch(setlastPrice(address, item.price))
        } else {
          dispatch(setlastPrice(address, 0))
        }
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
              dispatch(loadHistory(MARKET_DEFAULT_ADDR1, MARKET_DEFAULT_ADDR2))
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
              dispatch(loadHistory(MARKET_DEFAULT_ADDR1, MARKET_DEFAULT_ADDR2))
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

export function calcSwitch(address, type, price) {
  let value = 0;
  let stopPrice = 0;
  let sum = 0;
  let market;
  const func = (type === 'buy') ? 'bids' : 'asks'
  return hett.getContractByName('Market', address)
    .then((contract) => {
      market = contract;
      return market.call(func + 'Length')
    })
    .then(length => (
      promiseFor(i => (i < Number(length) && stopPrice < price), i => (
        getOrder(market, func, i)
          .then((order) => {
            if (type === 'buy') {
              let valuePart = 0
              if (order.price >= price) {
                valuePart = 1
              } else {
                valuePart = order.value
              }
              value += valuePart
              sum += order.price * valuePart
              stopPrice = order.price
            }
            return (i + 1);
          })
          .catch(() => false)
      ), 0)
    ))
    .then(() => (
      {
        value,
        stopPrice,
        sum
      }
    ))
}

function popupShow(message) {
  return popup({ message })
}

export function confirmSwitchOrder(message, address, data) {
  return dispatch => (
    confirmSwitch({ message })
      .then(() => {
        dispatch(send(address, 'orderMarket', [data.type, data.value]))
      })
      .catch(() => Promise.reject(Error('cancel!')))
  )
}

export function switchDir() {
  return (dispatch, getState) => {
    const state = getState()
    const address1 = MARKET_DEFAULT_ADDR1
    const address2 = MARKET_DEFAULT_ADDR2
    const names = {
      [address1]: 'A',
      [address2]: 'B'
    }
    const market = {
      [address1]: null,
      [address2]: null
    }
    let price1 = 0
    let price2 = 0
    if (_.has(state.market.modules, address1)) {
      market[address1] = state.market.modules[address1]
      if (_.has(market[address1], 'lastPrice')) {
        price1 = market[address1].lastPrice
      }
    }
    if (_.has(state.market.modules, address2)) {
      market[address2] = state.market.modules[address2]
      if (_.has(market[address2], 'lastPrice')) {
        price2 = market[address2].lastPrice
      }
    }
    if (price1 > 0 && price2 > 0) {
      let activeMarket = MARKET_DEFAULT_ADDR1
      if (price2 > price1) {
        activeMarket = MARKET_DEFAULT_ADDR2
      }
      const deactiveMarket = (activeMarket === MARKET_DEFAULT_ADDR1) ?
        MARKET_DEFAULT_ADDR2 : MARKET_DEFAULT_ADDR1
      const priceDir = 'up'
      const type = 'buy'
      const typeNum = (type === 'buy') ? 1 : 0
      let marketOp = null
      let price = 0
      // если цену нужно увеличить
      if (priceDir === 'up') {
        // ищем лот на противоположном рынке
        price = market[activeMarket].lastPrice + 1
        marketOp = market[deactiveMarket]
      } else {
        // ищем лот на противоположном рынке
        price = market[activeMarket].lastPrice - 1
        marketOp = market[activeMarket]
      }
      calcSwitch(marketOp.address, type, price)
        .then((result) => {
          if (result.stopPrice >= price) {
            let approve = 0
            let base = null
            let quote = null
            if (_.has(marketOp, 'info') && _.has(state.token.modules, marketOp.info.base) && _.has(state.token.modules, marketOp.info.quote)) {
              if (_.has(state.token.modules[marketOp.info.base], 'info')) {
                base = state.token.modules[marketOp.info.base]
                if (_.has(base.approve, marketOp.address)) {
                  approve = base.approve[marketOp.address];
                }
              }
              if (_.has(state.token.modules[marketOp.info.quote], 'info')) {
                quote = state.token.modules[marketOp.info.quote]
                if (_.has(quote.approve, marketOp.address)) {
                  approve = quote.approve[marketOp.address];
                }
              }
            }
            if (base !== null && quote !== null) {
              let message = '<p>' + i18next.t('market:messageSwitch', { value: '<b>' + result.value + ' ' + base.info.symbol + '</b>', sum: '<b>' + result.sum + ' AIR</b>' }) + '</p>'
              if (result.sum <= approve) {
                console.log('покупаем', typeNum, result);
                dispatch(confirmSwitchOrder(
                  message, marketOp.address, { type: typeNum, value: result.value }
                ))
              } else {
                message += '<p>' + i18next.t('market:nonApprove', { market: '<b>' + names[marketOp.address] + '</b>' }) + '</p>'
                message += '<p>' + i18next.t('market:approveSum', { sum: '<b>' + result.sum + '</b>', approve: '<b>' + approve + '</b>' }) + '</p>'
                message += '<p>' + i18next.t('market:approveText') + '</p>'
                popupShow(message)
              }
            } else {
              console.log('нет информации о токене');
              popupShow('<p>Error.</p>')
            }
          } else {
            popupShow('<p>' + i18next.t('market:notFoundLot') + '</p>')
            console.log('нет подходящих лотов, у всех цена меньше ' + price);
          }
        })
    }
  }
}
