import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import { loadModule } from '../../../modules/marketLiability/actions';
import Buy from './buy';
import Bids from './bids';
import Asks from './asks';
import { AIRA_MARKET_ADDR } from '../../../config/config'

class Container extends Component {
  componentWillMount() {
    this.props.loadModule();
  }
  render() {
    if (this.props.market.isLoad === true || !_.has(this.props.market, 'info')) {
      return <p>...</p>
    }
    return (<div>
      <div>
        <h1>{this.props.market.info.name}</h1>
        <hr />
        <p>address: {this.props.market.address}</p>
        <p>taxman: {this.props.market.info.taxman}</p>
        <p>comission: {this.props.market.info.comission}%</p>
        <div className="row">
          <div className="col-md-12">
            <Buy address={this.props.market.address} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <ul className="nav nav-tabs">
              <li className="active"><a href="#1" data-toggle="tab">Buy</a></li>
              <li><a href="#2" data-toggle="tab">Sell</a></li>
            </ul>
            <div className="tab-content">
              <div className="tab-pane active" id="1">
                <Bids address={this.props.market.address} />
              </div>
              <div className="tab-pane" id="2">
                <Asks address={this.props.market.address} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}

function mapStateToProps(state) {
  const address = AIRA_MARKET_ADDR
  let market = {
    address,
    isLoad: true
  };
  if (_.has(state.marketLiability.modules, address)) {
    market = state.marketLiability.modules[address]
  }
  return {
    market
  }
}
function mapDispatchToProps(dispatch) {
  const actions = bindActionCreators({
    loadModule
  }, dispatch)
  const address = AIRA_MARKET_ADDR
  return {
    loadModule: () => actions.loadModule(address)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container)
