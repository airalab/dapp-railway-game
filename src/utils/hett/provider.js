import _ from 'lodash'

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
      return Promise.resolve(this.abis[name]);
    }
    return Promise.reject(Error('Not found ABI. ' + name));
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
      return Promise.resolve(this.addresses[name]);
    }
    return Promise.reject(Error('Not found address. ' + name));
  }
}
