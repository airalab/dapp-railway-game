import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import i18next from 'i18next'
import { translate, Interpolate } from 'react-i18next';
import { MARKET_DEFAULT_ADDR1, MARKET_DEFAULT_ADDR2 } from '../../../config/config'
import { Main } from '../components/main'
import { Youtube } from '../components/video'
import { Main as Log } from '../components/log'
import { loadModule, loadLastPrice } from '../../../modules/market/actions';
import { load } from '../../../modules/history/actions';
import { timeConverter } from '../../../utils/helper'

class Container extends Component {
  componentWillMount() {
    this.props.loadModule(this.props.address1);
    this.props.loadModule(this.props.address2);
    this.props.loadLastPrice(this.props.address1);
    this.props.loadLastPrice(this.props.address2);
    this.props.load(this.props.address1, this.props.address2);
  }
  render() {
    return (<div>
      <div>
        <p>{i18next.t('appDesc')}</p>
        <blockquote>
          <Interpolate parent={'p'} i18nKey={'common:appNotice'} useDangerouslySetInnerHTML />
        </blockquote>
        <h1>{i18next.t('title1')}</h1>
        <Main
          address1={this.props.address1}
          price1={this.props.price1}
          style1={this.props.style1}
          base1={this.props.base1}
          quote1={this.props.quote1}
          address2={this.props.address2}
          price2={this.props.price2}
          style2={this.props.style2}
          base2={this.props.base2}
          quote2={this.props.quote2}
        />
        <h2>{i18next.t('title2')}</h2>
        <Youtube />
        <h2>{i18next.t('title3')}</h2>
        <Log rows={this.props.log} />
      </div>
    </div>)
  }
}

function getLogs(history, address1, address2) {
  const log = [];
  let currentType = null;
  let currentPrice = null;
  const pricesLast = {
    [address1]: 0,
    [address2]: 0,
  }
  const markets = {
    [address1]: ['A', 'B'],
    [address2]: ['B', 'А'],
  }
  _.forEach(history, (item) => {
    let row = timeConverter(item.time) + ' ' + i18next.t('history:priceFutures') + ' ' + markets[item.type][0];
    let dir = i18next.t('history:up');
    if (item.price < pricesLast[item.type]) {
      dir = i18next.t('history:down');
    }
    if (item.type !== currentType && item.price > currentPrice) {
      dir = i18next.t('history:upPrice') + ' ' + markets[item.type][1];
    }
    pricesLast[item.type] = item.price;
    row += ' ' + dir + '!'
    if (item.type !== currentType && item.price > currentPrice) {
      currentType = item.type;
      row += ' ' + i18next.t('history:market') + ' ' + markets[address1][0] + ': ' + pricesLast[address1] + ' AIR vs ' + i18next.t('history:market') + ' ' + markets[address2][0] + ': ' + pricesLast[address2] + ' AIR. ' + i18next.t('history:changeDir') + ' ' + markets[currentType][0] + '.';
    } else {
      row += ' ' + i18next.t('history:lastOrder') + ': ' + item.price + ' AIR. ' + i18next.t('history:sameDir') + ' ' + markets[currentType][0] + '.';
    }
    if (item.type === currentType) {
      currentPrice = item.price;
    }
    log.push(row);
  });
  return _.reverse(log);
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
  const log = getLogs(state.history.items, address1, address2).slice(0, 20)
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
    style2,
    log
  }
}
function mapDispatchToProps(dispatch) {
  const actions = bindActionCreators({
    loadModule,
    loadLastPrice,
    load
  }, dispatch)
  return {
    loadModule: actions.loadModule,
    loadLastPrice: actions.loadLastPrice,
    load: actions.load
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Container))
