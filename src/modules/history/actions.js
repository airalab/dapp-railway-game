import Promise from 'bluebird'
import _ from 'lodash'
import hett from 'hett'
import { SET_HISTORY } from './actionTypes'

export function setHistory(log) {
  return {
    type: SET_HISTORY,
    payload: log
  }
}

const getLog = (address) => {
  const options = {
    fromBlock: 0,
    toBlock: 'latest',
    address,
    topics: ['0xa7bec7790a90eefc51c752a274c61fa256e58e17fbfeb1340045117ada7f2f44']
  }
  return new Promise((resolve, reject) => {
    const filter = hett.web3.eth.filter(options);
    filter.get((error, result) => {
      if (error) {
        reject(error);
      }
      const log = []
      if (result.length > 0) {
        _.forEach(result, (value) => {
          const id = parseInt(value.topics[1], 16)
          log.push({
            blockNumber: value.blockNumber,
            type: address,
            id
          })
        })
      }
      resolve(log);
    })
  });
}

const getPrice = (address, id) => (
  hett.getContractByName('Market', address)
    .then(contract => contract.call('priceOf', [id]))
    .then(price => Number(price))
)

const getBlock = hash => (
  hett.web3h.getBlock(hash)
    .then(item => item.timestamp)
)

export function load(address1, address2) {
  return (dispatch) => {
    let log = []
    getLog(address1)
      .then((log1) => {
        log = log.concat(log1);
        return getLog(address2)
      })
      .then((log2) => {
        log = log.concat(log2);
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
        log = _.sortBy(log, ['time']);
        dispatch(setHistory(_.reverse(log)));
      })
  }
}
