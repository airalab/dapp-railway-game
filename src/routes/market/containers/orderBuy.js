import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import Buy from '../components/buy/buy';
import { orderMarket } from '../../../modules/market/actions';
import { add, reset } from '../../../modules/forms/actions';

class Container extends Component {
  componentWillMount() {
    this.props.formAdd();
  }
  render() {
    return <Buy {...this.props} />
  }
}

function mapStateToProps(state, props) {
  const idForm = 'orderMarket_1_' + props.address;
  const address = props.address
  let market = {
    address,
    isLoadBids: true
  }
  let orders = [];
  let ap = 0;
  let token;
  let base = {
    info: {
      name: '',
      symbol: ''
    }
  }
  let quote = {
    info: {
      name: '',
      symbol: ''
    }
  }
  if (_.has(state.market.modules, address)) {
    market = { ...market, ...state.market.modules[address] }
    if (_.has(market, 'info') && _.has(state.token.modules, market.info.base) && _.has(state.token.modules, market.info.quote)) {
      if (_.has(state.token.modules[market.info.base], 'info')) {
        base = state.token.modules[market.info.base]
      }
      if (_.has(state.token.modules[market.info.quote], 'info')) {
        quote = state.token.modules[market.info.quote]
        if (_.has(quote.approve, address)) {
          ap = quote.approve[address];
        }
      }
      token = market.info.quote
    }
    if (_.has(market, 'bids')) {
      orders = _.sortBy(market.bids, ['price'])
    }
  }
  let formInfo = {
    reset: false,
    message: ''
  }
  if (_.has(state.forms.items, idForm)) {
    formInfo = state.forms.items[idForm]
  }
  return {
    idForm,
    formInfo,
    address,
    base,
    quote,
    token,
    approve: ap,
    validate: (form) => {
      const v = Number(form.value);
      if (v <= 0) {
        return false;
      }
      return true;
    },
    calcApprove: (v) => {
      const allowance = new BigNumber(ap);
      let quoteValue = new BigNumber(0);
      let value = new BigNumber(v);
      _.forEach(orders, (order) => {
        if (value > 0) {
          if (order.value >= value) {
            const orderPrice = new BigNumber(order.price);
            quoteValue = quoteValue.plus(orderPrice.times(value));
            value = new BigNumber(0);
          } else {
            const orderPrice = new BigNumber(order.price);
            const orderValue = new BigNumber(order.value);
            quoteValue = quoteValue.plus(orderPrice.times(orderValue));
            value = value.minus(orderValue);
          }
        }
      })
      return [value.toNumber(), quoteValue.minus(allowance).toNumber(), quoteValue.toNumber()]
    }
  }
}
function mapDispatchToProps(dispatch, props) {
  const idForm = 'orderMarket_1_' + props.address;
  const actions = bindActionCreators({
    orderMarket,
    add,
    reset
  }, dispatch)
  return {
    onSubmit: form => actions.orderMarket(props.address, [1, form.value], idForm),
    formAdd: () => actions.add(idForm),
    formReset: bool => actions.reset(idForm, bool)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container)
