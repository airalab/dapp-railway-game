import Promise from 'bluebird'
import _ from 'lodash'
import { coinbase } from './web3h'

export default class Contract {
  constructor(contract) {
    this.web3Contract = contract;
  }

  call(func, args = []) {
    return new Promise((resolve, reject) => {
      this.web3Contract[func](...args, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      })
    });
  }

  send(func, args = [], txArgs = {}) {
    return new Promise((resolve, reject) => {
      const paramsGas = args.concat([
        _.merge({
          from: coinbase()
        }, txArgs)
      ]);
      this.web3Contract[func].estimateGas(...paramsGas, (error, gas) => {
        if (error) {
          reject(error);
        }
        const params = args.concat([
          _.merge({
            from: coinbase(),
            gas: gas + 50000
          }, txArgs)
        ]);
        console.log('send', func, params);
        this.web3Contract[func](...params, (errorTx, result) => {
          if (errorTx) {
            reject(errorTx);
          }
          resolve(result);
        })
      })
    });
  }

  watch(func) {
    return new Promise((resolve, reject) => {
      const event = this.web3Contract[func]({}, '', (error, result) => {
        if (error) {
          reject(error);
        }
        event.stopWatching((e, r) => {
          console.log(e, r);
        })
        resolve(result.args);
      })
    });
  }

  listen(func, cb) {
    this.web3Contract[func]({}, '', (error, result) => {
      if (error) {
        console.log(error);
        return;
      }
      cb(result.args)
    })
  }
}
