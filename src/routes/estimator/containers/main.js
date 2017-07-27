import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import { loadModule } from '../../../modules/estimator/actions';
import { Main } from '../components/estimator';
import { ESTIMATOR_ADDR } from '../../../config/config'

class Container extends Component {
  componentWillMount() {
    this.props.loadModule();
  }
  render() {
    return (<div>
      <h1>Estimator</h1>
      <hr />
      {(this.props.module.isLoad === false && _.has(this.props.module, 'info')) ?
        <Main {...this.props.module} />
        :
        <p>...</p>
      }
    </div>)
  }
}

function mapStateToProps(state) {
  const address = ESTIMATOR_ADDR
  let module = {
    address,
    isLoad: true
  };
  if (_.has(state.estimator.modules, address)) {
    module = state.estimator.modules[address]
    if (_.has(module, 'info')) {
      if (_.has(state.token.modules, module.info.air) &&
      _.has(state.token.modules[module.info.air].balance, address)) {
        module = {
          ...module,
          air: state.token.modules[module.info.air].balance[address]
        }
      }
      if (_.has(state.token.modules, module.info.metrics) &&
      _.has(state.token.modules[module.info.metrics].balance, address)) {
        module = {
          ...module,
          metrics: state.token.modules[module.info.metrics].balance[address]
        }
      }
    }
  }
  return {
    module
  }
}
function mapDispatchToProps(dispatch) {
  const actions = bindActionCreators({
    loadModule
  }, dispatch)
  const address = ESTIMATOR_ADDR
  return {
    loadModule: () => actions.loadModule(address)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container)
