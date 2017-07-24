import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import hett from 'hett'
import Approve from '../components/approve/main';
import { send as tokenSend } from '../../../modules/token/actions';

function mapStateToProps(state, props) {
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
    address,
    tokenInfo,
    token,
    approve: ap,
    balance,
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
  const actions = bindActionCreators({
    tokenSend
  }, dispatch)
  return {
    onSubmit: form => actions.tokenSend(props.token, 'approve', [props.address, form.value])
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Approve)
