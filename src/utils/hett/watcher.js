import Promise from 'bluebird'
import _ from 'lodash'

export default class Watcher {
  subscribes = [];
  addresses = {};
  web3 = false;
  status = false;
  statusAddresses = false;

  constructor(web3) {
    this.web3 = web3;
  }

  addSubscribe(cb) {
    this.subscribes.push(cb);
    this.run();
  }

  addTx(tx) {
    return new Promise((resolve) => {
      this.addSubscribe({
        tx,
        cb: (txId) => {
          resolve(txId)
        }
      });
    });
  }

  removeTx(tx) {
    _.remove(this.subscribes, f => !_.isFunction(f) && f.tx === tx);
  }

  addAddress(address, name, cb, params = {}) {
    const addressLower = _.toLower(address);
    if (!_.has(this.addresses, addressLower) || !_.has(this.addresses, [addressLower, name])) {
      this.addresses = _.set(this.addresses, [addressLower, name], () => cb(address, params));
      this.runAddresses();
    }
  }

  runAddresses() {
    if (this.statusAddresses === false) {
      this.addSubscribe((bl) => {
        _.forEach(bl.transactions, (txId) => {
          this.web3.eth.getTransaction(txId, (errTx, transaction) => {
            if (transaction) {
              if (_.has(this.addresses, transaction.to)) {
                _.forEach(this.addresses[transaction.to], (cb) => {
                  cb()
                });
              }
            }
          })
        })
      });
      this.statusAddresses = true;
    }
  }

  run() {
    if (this.status === false) {
      this.web3.eth.filter('latest').watch((e, hash) => {
        if (!e) {
          this.web3.eth.getBlock(hash, false, (err, blockInfo) => {
            if (!_.isEmpty(blockInfo)) {
              _.forEach(this.subscribes, (item) => {
                if (_.isFunction(item)) {
                  item(blockInfo)
                } else if (_.findIndex(blockInfo.transactions, i => i === item.tx) >= 0) {
                  this.web3.eth.getTransaction(item.tx, (errTx, transaction) => {
                    if (transaction) {
                      item.cb(transaction)
                      this.removeTx(item.tx)
                    }
                  })
                }
              })
            }
          });
        }
      });
      this.status = true;
    }
  }
}
