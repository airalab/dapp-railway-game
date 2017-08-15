import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import hett from 'hett'
import { Form } from 'vol4-form'
import i18next from 'i18next'
import Approve from '../components/approve/main';
import { approve as tokenApprove } from '../../../modules/token/actions';

const ContainerApprove = props => (
  <Form id={props.idForm} {...props} onSubmit={props.onSubmit}>
    <Approve />
  </Form>
)

function mapStateToProps(state, props) {
  const idForm = 'approve_' + props.token + '_' + props.address;
  const coinbase = hett.web3h.coinbase()
  const token = props.token
  const address = props.address
  let balance = 0
  let ap = 0;
  let tokenInfo = {
    info: {
      name: '',
      symbol: ''
    }
  }
  if (_.has(state.market.modules, address)) {
    const market = state.market.modules[address]
    if (_.has(market, 'info') && _.has(state.token.modules, token)) {
      if (_.has(state.token.modules[token], 'info')) {
        tokenInfo = state.token.modules[token]
        if (_.has(tokenInfo.balance, coinbase)) {
          balance = tokenInfo.balance[coinbase];
        }
        if (_.has(tokenInfo.approve, address)) {
          ap = tokenInfo.approve[address];
        }
      }
    }
  }
  return {
    idForm,
    address,
    tokenInfo,
    token,
    approve: ap,
    balance,
    fields: {
      value: {
        value: '',
        type: 'text',
      }
    },
    onValidate: (form) => {
      const errors = {}
      if (Number(form.value) <= 0) {
        errors.value = i18next.t('market:formErrMsg')
      }
      return errors;
    }
  }
}
function mapDispatchToProps(dispatch, props) {
  const idForm = 'approve_' + props.token + '_' + props.address;
  const actions = bindActionCreators({
    tokenApprove
  }, dispatch)
  return {
    onSubmit: form => actions.tokenApprove(props.token, [props.address, form.value], idForm)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContainerApprove)
