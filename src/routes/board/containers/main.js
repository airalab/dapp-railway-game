import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import { Link } from 'react-router'
import { loadModule, loadLastPrice } from '../../../modules/market/actions';
import { MARKET_DEFAULT_ADDR1, MARKET_DEFAULT_ADDR2 } from '../../../config/config'

class Container extends Component {
  componentWillMount() {
    this.props.loadModule(this.props.address1);
    this.props.loadModule(this.props.address2);
    this.props.loadLastPrice(this.props.address1);
    this.props.loadLastPrice(this.props.address2);
  }
  render() {
    return (<div>
      <div>
        <h1>Markets</h1>
        <div className="row">
          <div className="col-md-6">
            <div className={this.props.style1}>
              <div className="panel-body">
                <h1>{this.props.base1.info.name}</h1>
                <h2>{this.props.price1} {this.props.quote1.info.symbol}</h2>
                <div className="text-center">
                  <Link to={'/market/' + this.props.address1} className="btn btn-info">market</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className={this.props.style2}>
              <div className="panel-body">
                <h1>{this.props.base2.info.name}</h1>
                <h2>{this.props.price2} {this.props.quote2.info.symbol}</h2>
                <div className="text-center">
                  <Link to={'/market/' + this.props.address2} className="btn btn-info">market</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}

function mapStateToProps(state) {
  const address1 = MARKET_DEFAULT_ADDR1
  const address2 = MARKET_DEFAULT_ADDR2
  let price1 = 0
  let price2 = 0
  let base1 = {
    info: {
      name: '',
      symbol: ''
    }
  }
  let quote1 = {
    info: {
      name: '',
      symbol: ''
    }
  }
  let base2 = {
    info: {
      name: '',
      symbol: ''
    }
  }
  let quote2 = {
    info: {
      name: '',
      symbol: ''
    }
  }
  if (_.has(state.market.modules, address1)) {
    const market = state.market.modules[address1]
    if (_.has(market, 'info') && _.has(state.token.modules, market.info.base) && _.has(state.token.modules, market.info.quote)) {
      if (_.has(state.token.modules[market.info.base], 'info')) {
        base1 = state.token.modules[market.info.base]
      }
      if (_.has(state.token.modules[market.info.quote], 'info')) {
        quote1 = state.token.modules[market.info.quote]
      }
      if (_.has(market, 'lastPrice')) {
        price1 = market.lastPrice
      }
    }
  }
  if (_.has(state.market.modules, address2)) {
    const market = state.market.modules[address2]
    if (_.has(market, 'info') && _.has(state.token.modules, market.info.base) && _.has(state.token.modules, market.info.quote)) {
      if (_.has(state.token.modules[market.info.base], 'info')) {
        base2 = state.token.modules[market.info.base]
      }
      if (_.has(state.token.modules[market.info.quote], 'info')) {
        quote2 = state.token.modules[market.info.quote]
      }
      if (_.has(market, 'lastPrice')) {
        price2 = market.lastPrice
      }
    }
  }
  let style1 = 'panel panel-default'
  let style2 = 'panel panel-default'
  if (price1 > price2) {
    style1 = 'panel panel-primary'
    style2 = 'panel panel-warning'
  } else if (price2 > price1) {
    style2 = 'panel panel-primary'
    style1 = 'panel panel-warning'
  } else if (price1 > 0 && price2 > 0 && price1 === price2) {
    style1 = 'panel panel-info'
    style2 = 'panel panel-info'
  }
  return {
    address1,
    address2,
    base1,
    quote1,
    base2,
    quote2,
    price1,
    price2,
    style1,
    style2
  }
}
function mapDispatchToProps(dispatch) {
  const actions = bindActionCreators({
    loadModule,
    loadLastPrice
  }, dispatch)
  return {
    loadModule: actions.loadModule,
    loadLastPrice: actions.loadLastPrice
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container)
