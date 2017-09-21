import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { Form } from 'vol4-form'
import i18next from 'i18next'
import Add from '../components/sell/add';
import { sendOrder } from '../../../modules/market/actions';

const Container = props => (
  <Form id={props.idForm} {...props} onSubmit={props.onSubmit}>
    <Add />
  </Form>
)

function mapStateToProps(state, props) {
  const idForm = 'orderLimit_0_' + props.address;
  const address = props.address
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
    const market = state.market.modules[address]
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
      token = base.address;
    }
  }
  return {
    idForm,
    address,
    base,
    quote,
    token,
    approve: ap,
    fields: {
      value: {
        value: '',
        type: 'text',
      },
      price: {
        value: '',
        type: 'text',
      }
    },
    onValidate: (form) => {
      const errors = {}
      if (Number(form.value) <= 0) {
        errors.value = i18next.t('market:formErrMsg')
      }
      if (Number(form.price) <= 0) {
        errors.price = i18next.t('market:formErrMsg')
      }
      return errors;
    },
    calcApprove: (v) => {
      const value = new BigNumber(v);
      const allowance = new BigNumber(ap);
      return value.minus(allowance).toNumber();
    }
  }
}
function mapDispatchToProps(dispatch, props) {
  const idForm = 'orderLimit_0_' + props.address;
  const actions = bindActionCreators({
    sendOrder,
  }, dispatch)
  return {
    onSubmit: form => actions.sendOrder(props.address, { ...form, type: 'sell' }, idForm),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container)
