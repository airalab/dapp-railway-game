import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { Main } from '../components/buy';
import { send as marketSend } from '../../../modules/marketLiability/actions';
import { send as tokenSend } from '../../../modules/token/actions';
import { TOKEN_ADDR_AIR } from '../../../config/config'

function mapStateToProps(state, props) {
  const tokenAddress = TOKEN_ADDR_AIR
  const address = props.address
  let ap = 0;
  let comission = 0;
  let token
  if (_.has(state.marketLiability.modules, address)) {
    const market = state.marketLiability.modules[address]
    if (_.has(market, 'info') && _.has(state.token.modules, tokenAddress)) {
      comission = market.info.comission
      if (_.has(state.token.modules, tokenAddress)) {
        token = state.token.modules[tokenAddress]
        if (_.has(token.approve, address)) {
          ap = token.approve[address];
        }
      }
    }
  }
  return {
    address,
    token: tokenAddress,
    calcApprove: (p) => {
      if (p === '') {
        return false
      }
      const price = new BigNumber(p);
      const approve = new BigNumber(ap);
      let com = new BigNumber(comission);
      com = com.times(price).div(100).floor();
      return [com.toNumber(), price.minus(approve).plus(com).toNumber()]
    }
  }
}
function mapDispatchToProps(dispatch, props) {
  const actions = bindActionCreators({
    marketSend,
    tokenSend
  }, dispatch)
  return {
    onSubmit: form => actions.marketSend(props.address, 'limitBuy', [form.price]),
    onApprove: (address, to, value) => actions.tokenSend(address, 'approve', [to, value])
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
