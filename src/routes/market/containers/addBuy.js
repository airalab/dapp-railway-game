import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import Add from '../components/buy/add';
import { orderLimit } from '../../../modules/market/actions';
import { add, reset } from '../../../modules/forms/actions';

class Container extends Component {
  componentWillMount() {
    this.props.formAdd();
  }
  render() {
    return <Add {...this.props} />
  }
}

function mapStateToProps(state, props) {
  const idForm = 'orderLimit_1_' + props.address;
  const address = props.address
  let ap = 0;
  let decimals = 0;
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
    const market = state.market.modules[address]
    if (_.has(market, 'info') && _.has(state.token.modules, market.info.base) && _.has(state.token.modules, market.info.quote)) {
      decimals = market.info.decimals
      if (_.has(state.token.modules[market.info.base], 'info')) {
        base = state.token.modules[market.info.base]
      }
      if (_.has(state.token.modules[market.info.quote], 'info')) {
        quote = state.token.modules[market.info.quote]
        if (_.has(quote.approve, address)) {
          ap = quote.approve[address];
        }
      }
      token = quote.address;
    }
  }
  decimals = 0
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
      const p = Number(form.price);
      if (v <= 0 || p <= 0) {
        return false;
      }
      return true;
    },
    calcApprove: (v, p) => {
      const price = new BigNumber(p);
      const value = new BigNumber(v);
      const allowance = new BigNumber(ap);
      const amount = price.times(value).div((new BigNumber(10)).pow(decimals));
      return amount.minus(allowance).toNumber();
    }
  }
}
function mapDispatchToProps(dispatch, props) {
  const idForm = 'orderLimit_1_' + props.address;
  const actions = bindActionCreators({
    orderLimit,
    add,
    reset
  }, dispatch)
  return {
    onSubmit: form => actions.orderLimit(props.address, [1, form.value, form.price], idForm),
    formAdd: () => actions.add(idForm),
    formReset: bool => actions.reset(idForm, bool)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container)
