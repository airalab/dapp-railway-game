import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import { Main } from '../components/buy';
import { send as estimatorSend } from '../../../modules/estimator/actions';
import { send as tokenSend } from '../../../modules/token/actions';

function mapStateToProps(state, props) {
  const address = props.address
  let airAddress;
  let ap = 0;
  let price = 0;
  let startTime = 0;
  let estimationPeriod = 0;
  let is = false;
  if (_.has(state.estimator.modules, address)) {
    const module = state.estimator.modules[address]
    if (_.has(module, 'info') && _.has(state.token.modules, module.info.air)) {
      const air = state.token.modules[module.info.air]
      airAddress = module.info.air
      price = module.info.metricsPrice;
      startTime = module.info.startTime;
      estimationPeriod = module.info.estimationPeriod;
      if (_.has(air.approve, address)) {
        ap = air.approve[address];
      }
    }
  }
  if (price > 0 && ((Date.now() / 1000) - startTime) <= estimationPeriod) {
    is = true;
  }
  return {
    address,
    airAddress,
    approve: ap,
    price,
    is
  }
}
function mapDispatchToProps(dispatch, props) {
  const actions = bindActionCreators({
    estimatorSend,
    tokenSend
  }, dispatch)
  return {
    onSubmit: form => actions.estimatorSend(props.address, 'buyMetrics', [form.count]),
    onApprove: (address, to, value) => actions.tokenSend(address, 'approve', [to, value])
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
