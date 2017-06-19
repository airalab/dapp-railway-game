import Promise from 'bluebird'

let indexAccount = 0
export function setAccount(index) {
  indexAccount = index
}

export function coinbase() {
  return web3.eth.accounts[indexAccount]
}

export function isAccounts() {
  if (web3.eth.accounts.length > 0) {
    return true
  }
  return false
}

export function getBalance(address, currency = 'ether') {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(address, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(Number(web3.fromWei(result, currency)));
    });
  });
}

export function getBlock(hash) {
  return new Promise((resolve, reject) => {
    web3.eth.getBlock(hash, false, (error, blockInfo) => {
      if (error) {
        reject(error);
      }
      resolve(blockInfo);
    });
  });
}

export function getLogs(options, cb) {
  web3.eth.filter(options, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      cb(result);
    }
  });
}

export function transfer(from, to, value, isEther = true) {
  return new Promise((resolve, reject) => {
    web3.eth.sendTransaction({
      from,
      to,
      value: (isEther) ? web3.toWei(value, 'ether') : value
    }, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  });
}

export function getTransaction(txId) {
  return new Promise((resolve, reject) => {
    web3.eth.getTransaction(txId, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  });
}
