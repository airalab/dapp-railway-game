import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import Sell from '../components/sell/sell';
import { orderMarket } from '../../../modules/market/actions';
import { add, reset } from '../../../modules/forms/actions';

class Container extends Component {
  componentWillMount() {
    this.props.formAdd();
  }
  render() {
    return <Sell {...this.props} />
  }
}

function mapStateToProps(state, props) {
  const idForm = 'orderMarket_0_' + props.address;
  const address = props.address
  let market = {
    address
  }
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
        if (_.has(base.approve, address)) {
          ap = base.approve[address];
        }
      }
      if (_.has(state.token.modules[market.info.quote], 'info')) {
        quote = state.token.modules[market.info.quote]
      }
      token = market.info.base
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
      const value = new BigNumber(v);
      const allowance = new BigNumber(ap);
      return value.minus(allowance).toNumber();
    }
  }
}
function mapDispatchToProps(dispatch, props) {
  const idForm = 'orderMarket_0_' + props.address;
  const actions = bindActionCreators({
    orderMarket,
    add,
    reset
  }, dispatch)
  return {
    onSubmit: form => actions.orderMarket(props.address, [0, form.value], idForm),
    formAdd: () => actions.add(idForm),
    formReset: bool => actions.reset(idForm, bool)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container)
