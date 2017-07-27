import Promise from 'bluebird'
import _ from 'lodash'
import { SET_HISTORY } from './actionTypes'
import { ORDER_CLOSED, ORDER_PARTIAL } from '../../config/config'
import { getLog, getPrice, getBlock } from '../../utils/helper'

export function setHistory(log) {
  return {
    type: SET_HISTORY,
    payload: log
  }
}

export function load(address1, address2) {
  return (dispatch) => {
    let log = []
    getLog(address1, ORDER_CLOSED)
      .then((result) => {
        log = log.concat(result);
        return getLog(address1, ORDER_PARTIAL)
      })
      .then((result) => {
        log = log.concat(result);
        return getLog(address2, ORDER_CLOSED)
      })
      .then((result) => {
        log = log.concat(result);
        return getLog(address2, ORDER_PARTIAL)
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
        dispatch(setHistory(log));
      })
  }
}
