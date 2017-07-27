import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import hett from 'hett'
import i18next from 'i18next'
import { events, loadModule } from '../../../modules/market/actions';
import { Main as Buy } from '../components/buy';
import { Main as Sell } from '../components/sell';
import Approve from './approve';
import Asks from './asks';
import Bids from './bids';
import EthLink from '../../../shared/components/common/ethLink';
import { MARKET_DEFAULT_ADDR1 } from '../../../config/config';

class Container extends Component {
  componentWillMount() {
    this.props.events();
    this.props.loadModule();
  }
  render() {
    if (this.props.market.isLoad === true || !_.has(this.props.market, 'info')) {
      return <p>...</p>
    }
    return (<div>
      <div>
        <h1>Circle-market {(MARKET_DEFAULT_ADDR1 === this.props.market.address) ? 'A' : 'B'}</h1>
        <hr />
        <p>{i18next.t('market:addressContract')}: <EthLink address={this.props.market.address} /></p>
        <div className="row">
          <div className="col-md-6">
            <div className="panel panel-default">
              <div className="panel-body">
                <p>
                  <b>
                    <EthLink
                      address={this.props.market.info.base}
                      title={this.props.base.info.name}
                      type="token"
                    />
                  </b>
                </p>
                <Approve token={this.props.market.info.base} address={this.props.market.address} />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="panel panel-default">
              <div className="panel-body">
                <p>
                  <b>
                    <EthLink
                      address={this.props.market.info.quote}
                      title={this.props.quote.info.name}
                      type="token"
                    />
                  </b>
                </p>
                <Approve token={this.props.market.info.quote} address={this.props.market.address} />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Buy address={this.props.market.address} />
          </div>
          <div className="col-md-6">
            <Sell address={this.props.market.address} />
          </div>
        </div>
        <h2>{i18next.t('market:titleLots')}</h2>
        <div className="row">
          <div className="col-md-6">
            <h3>{i18next.t('market:titleOrdersSell')}</h3>
            <Bids address={this.props.market.address} />
          </div>
          <div className="col-md-6">
            <h3>{i18next.t('market:titleOrdersBuy')}</h3>
            <Asks address={this.props.market.address} />
          </div>
        </div>
      </div>
    </div>)
  }
}

function mapStateToProps(state, props) {
  const address = props.params.address
  let market = {
    address,
    isLoad: true
  };
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
  let balanceBase = 0
  let balanceQuote = 0
  const coinbase = hett.web3h.coinbase()
  if (_.has(state.market.modules, address)) {
    market = state.market.modules[address]
    if (_.has(market, 'info') && _.has(state.token.modules, market.info.base) && _.has(state.token.modules, market.info.quote)) {
      if (_.has(state.token.modules[market.info.base], 'info')) {
        base = state.token.modules[market.info.base]
        if (_.has(base.balance, coinbase)) {
          balanceBase = base.balance[coinbase];
        }
      }
      if (_.has(state.token.modules[market.info.quote], 'info')) {
        quote = state.token.modules[market.info.quote]
        if (_.has(quote.balance, coinbase)) {
          balanceQuote = quote.balance[coinbase];
        }
      }
    }
  }
  return {
    language: state.app.language,
    market,
    base,
    quote,
    balanceBase,
    balanceQuote
  }
}
function mapDispatchToProps(dispatch, props) {
  const actions = bindActionCreators({
    events,
    loadModule
  }, dispatch)
  return {
    events: () => actions.events(props.params.address),
    loadModule: () => actions.loadModule(props.params.address)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container)
