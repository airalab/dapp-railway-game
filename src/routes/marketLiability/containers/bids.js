import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
import _ from 'lodash'
import { Main } from '../components/bids';
// import { loadBids } from '../../../modules/market/actions';

class ContainerBids extends Component {
  componentWillMount() {
    // this.props.loadBids(this.props.market);
  }
  render() {
    if (!this.props.isLoadBids) {
      return <Main {...this.props} />
    }
    return <p>...</p>
  }
}

function mapStateToProps(state, props) {
  const address = props.address
  let market = {
    address,
    isLoadBids: true,
    bids: []
  }
  if (_.has(state.marketLiability.modules, address)) {
    market = { ...market, ...state.marketLiability.modules[address] }
    if (_.has(market, 'bids')) {
      market.bids = _.sortBy(market.bids, ['price'])
    }
  }
  return {
    ...market
  }
}
// function mapDispatchToProps(dispatch) {
//   const actions = bindActionCreators({
//     loadBids
//   }, dispatch)
//   return {
//     loadBids: actions.loadBids
//   }
// }

export default connect(mapStateToProps)(ContainerBids)
