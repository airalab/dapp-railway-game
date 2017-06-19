import * as web3h from './web3h'
import Contract from './contract'
import Watcher from './watcher'

class Hett {
  constructor() {
    this.web3 = null;
    this.web3h = null;
    this.providerAbi = null;
    this.providerAddress = null;
    this.watcher = null;
  }

  init(web3, providerAbi = null, providerAddress = null) {
    this.web3 = web3;
    this.web3h = web3h;
    this.watcher = new Watcher(web3);
    this.setProviderAbi(providerAbi)
    this.setProviderAddress(providerAddress)
  }

  getContract(abi, address) {
    return new Contract(this.web3.eth.contract(abi).at(address))
  }

  getContractByName(name, address) {
    return this.getAbiByName(name)
      .then(abi => this.getContract(abi, address))
  }

  getAbiByName(name) {
    return this.providerAbi.getAbi(name);
  }

  setProviderAbi(provider) {
    this.providerAbi = provider;
  }

  getAddressByName(name) {
    return this.providerAddress.getAddress(name);
  }

  setProviderAddress(provider) {
    this.providerAddress = provider;
  }
}

export default new Hett()
