import Promise from 'bluebird'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import axios from 'axios'
import hett from 'hett'

export const promiseFor = Promise.method((condition, action, value) => {
  if (!condition(value)) return value;
  return action(value).then(promiseFor.bind(null, condition, action));
});

export const formatDecimals = (price, decimals) => {
  const priceNum = new BigNumber(price);
  return priceNum.shift(-decimals).toNumber();
}

export const getNetwork = () => {
  const funcAsync = Promise.promisify(hett.web3.version.getNetwork);
  return funcAsync()
    .then(result => Number(result))
}

export const getNetworkName = () => (
  getNetwork()
    .then((result) => {
      const networks = {
        1: 'main',
        3: 'ropsten',
        4: 'rinkeby',
        42: 'kovan'
      }
      if (_.has(networks, result)) {
        return networks[result]
      }
      return '???'
    })
)

export const timeConverter = (timestamp) => {
  const a = new Date(timestamp * 1000);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const sec = a.getSeconds();
  const time = date + ' ' + month + ' ' + year + ' ' +
    ((hour < 10) ? '0' + hour : hour) + ':' +
    ((min < 10) ? '0' + min : min) + ':' +
    ((sec < 10) ? '0' + sec : sec);
  return time;
}

const getUrlAbi = (contract) => {
  let isBuilder = false;
  if (/builder/i.test(contract)) {
    isBuilder = true;
  }
  let repo = 'core'
  let version = '64e36c8ea43bb06ae8dd81a65af6d769b366f3c1';
  if (isBuilder) {
    repo = 'DAO-Factory'
    version = 'cb5b7c0ad9203e773b1db058540846e62a2931ff';
  }
  let url = 'https://raw.githubusercontent.com/airalab/' + repo + '/' + version + '/abi/'
  url += contract + '.json'
  return url
}

export class ProviderAbi {
  constructor(abis) {
    this.abis = {};
    this.setAbi(abis);
  }

  setAbi(abis) {
    this.abis = abis;
  }

  getAbi(name) {
    if (_.has(this.abis, name)) {
      return new Promise((resolve) => {
        resolve(this.abis[name]);
      });
    }
    return axios.get(getUrlAbi(name)).then(results => results.data)
  }
}

export class ProviderAddress {
  constructor(addresses) {
    this.addresses = {};
    this.setAddress(addresses);
  }

  setAddress(addresses) {
    this.addresses = addresses;
  }

  getAddress(name) {
    if (_.has(this.addresses, name)) {
      return new Promise((resolve) => {
        resolve(this.addresses[name]);
      });
    }
    return hett.getContractByName('Core', this.addresses.Factory)
      .then(factory => factory.call('get', [name]))
  }
}

export function createModule(cotract, args) {
  return cotract.call('buildingCostWei')
    .then((result) => {
      args.push(0) // client
      return cotract.send('create', args, { value: result })
    })
}

export function createModuleWatch(cotract) {
  return cotract.watch('Builded')
    .then(params => params.instance)
}

function isAddress(address, required = true) {
  if (!required && (address === '' || address === '0')) {
    return true;
  }
  if (address && address.length === 42 && /^(0x)?[0-9a-f]{40}$/i.test(address)) {
    return true;
  }
  return false;
}

export const validate = (values, props) => {
  const errors = {};
  _.each(props.fields, (item) => {
    if (item.required && !values[item.name]) {
      errors[item.name] = 'required'
    } else {
      let isError
      switch (item.validation) {
        case 'address':
          isError = isAddress(values[item.name], item.required) ? false : 'bad address'
          break;
        case 'uint':
          isError = _.isNumber(values[item.name] * 1) && !_.isNaN(values[item.name] * 1) ? false : 'no number'
          break;
        default:
          isError = false
      }
      if (isError) {
        errors[item.name] = isError
      }
    }
  })
  return errors
};

export const getLog = (address, topics) => {
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
            logIndex: value.logIndex,
            // transactionHash: value.transactionHash,
            id
          })
        })
      }
      resolve(log);
    })
  });
}

export const getPrice = (address, id) => (
  hett.getContractByName('Market', address)
    .then(contract => contract.call('priceOf', [id]))
    .then(price => Number(price))
)

export const getBlock = hash => (
  hett.web3h.getBlock(hash)
    .then(item => item.timestamp)
)
