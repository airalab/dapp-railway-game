import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import hett from 'hett'
import Approve from '../components/approve/main';
import { approve as tokenApprove } from '../../../modules/token/actions';
import { add, reset } from '../../../modules/forms/actions';

class ContainerApprove extends Component {
  componentWillMount() {
    this.props.formAdd();
  }
  render() {
    return <Approve {...this.props} />
  }
}

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
  let formInfo = {
    reset: false,
    message: ''
  }
  if (_.has(state.forms.items, idForm)) {
    formInfo = state.forms.items[idForm]
  }
  return {
    idForm,
    address,
    tokenInfo,
    token,
    approve: ap,
    balance,
    formInfo,
    validate: (form) => {
      const v = Number(form.value);
      if (v <= 0) {
        return false;
      }
      return true;
    }
  }
}
function mapDispatchToProps(dispatch, props) {
  const idForm = 'approve_' + props.token + '_' + props.address;
  const actions = bindActionCreators({
    tokenApprove,
    add,
    reset
  }, dispatch)
  return {
    onSubmit: form => actions.tokenApprove(props.token, [props.address, form.value], idForm),
    formAdd: () => actions.add(idForm),
    formReset: bool => actions.reset(idForm, bool)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContainerApprove)
