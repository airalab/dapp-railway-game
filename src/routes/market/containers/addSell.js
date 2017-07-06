import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import Add from '../components/sell/add';
import { send as marketSend } from '../../../modules/market/actions';
import { send as tokenSend } from '../../../modules/token/actions';

function mapStateToProps(state, props) {
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
    calcApprove: (v) => {
      const value = new BigNumber(v);
      const allowance = new BigNumber(ap);
      return value.minus(allowance).toNumber();
    }
  }
}
function mapDispatchToProps(dispatch, props) {
  const actions = bindActionCreators({
    marketSend,
    tokenSend
  }, dispatch)
  return {
    onSubmit: form => actions.marketSend(props.address, 'orderLimit', [0, form.value, form.price]),
    onApprove: (address, to, value) => actions.tokenSend(address, 'approve', [to, value])
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Add)
