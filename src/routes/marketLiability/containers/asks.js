import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
import _ from 'lodash'
import { Main } from '../components/asks';
// import { loadAsks } from '../../../modules/market/actions';

class ContainerAsks extends Component {
  componentWillMount() {
    // this.props.loadAsks(this.props.market);
  }
  render() {
    if (!this.props.isLoadAsks) {
      return <Main {...this.props} />
    }
    return <p>...</p>
  }
}

function mapStateToProps(state, props) {
  const address = props.address
  let market = {
    address,
    isLoadAsks: true,
    asks: []
  }
  if (_.has(state.marketLiability.modules, address)) {
    market = { ...market, ...state.marketLiability.modules[address] }
    if (_.has(market, 'asks')) {
      market.asks = _.reverse(_.sortBy(market.asks, ['price']))
    }
  }
  return {
    ...market
  }
}
// function mapDispatchToProps(dispatch) {
//   const actions = bindActionCreators({
//     loadAsks
//   }, dispatch)
//   return {
//     loadAsks: actions.loadAsks
//   }
// }

export default connect(mapStateToProps)(ContainerAsks)
