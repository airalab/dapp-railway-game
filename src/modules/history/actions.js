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

const getLog = (address, topics) => {
  const options = {
    fromBlock: 0,
    toBlock: 'latest',
    address,
    topics: [topics],
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
    getLog(address1, '0x4b5bcc2fcc61cdd6ab8b46567c95970321b41bf50984b3b38f13fc04015108ea') // OrderClosed
      .then((result) => {
        log = log.concat(result);
        return getLog(address1, '0xe4d55ff7be8673ff270b5b7b51fd4dec85115663575e80159581b7c75751d4ac') // OrderPartial
      })
      .then((result) => {
        log = log.concat(result);
        return getLog(address2, '0x4b5bcc2fcc61cdd6ab8b46567c95970321b41bf50984b3b38f13fc04015108ea') // OrderClosed
      })
      .then((result) => {
        log = log.concat(result);
        return getLog(address2, '0xe4d55ff7be8673ff270b5b7b51fd4dec85115663575e80159581b7c75751d4ac') // OrderPartial
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
        log = _.sortBy(log, ['time']);
        dispatch(setHistory(log));
      })
  }
}
