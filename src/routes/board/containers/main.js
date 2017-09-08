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
import { getVideo } from '../../../modules/app/actions';
import { timeConverter } from '../../../utils/helper'

class Container extends Component {
  componentWillMount() {
    this.props.loadModule(this.props.address1);
    this.props.loadModule(this.props.address2);
    this.props.loadLastPrice(this.props.address1);
    this.props.loadLastPrice(this.props.address2);
    this.props.load(this.props.address1, this.props.address2);
    this.props.getVideo();
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
        {this.props.video !== '' &&
          <div>
            <h2>{i18next.t('title2')}</h2>
            <Youtube id={this.props.video} />
          </div>
        }
        <h2>{i18next.t('title3')}</h2>
        <Log rows={this.props.log} />
      </div>
    </div>)
  }
}

function getLogs(history, address1, address2) {
  const log = [];
  let currentType = null;
  const pricesLast = {
    [address1]: 0,
    [address2]: 0,
  }
  const circles = {
    [address1]: address2,
    [address2]: address1,
  }
  const names = {
    [address1]: 'A',
    [address2]: 'B',
  }
  _.forEach(history, (item) => {
    // если цена не изменилась, то продолжает ехать
    // если цена снизилась
    // цена стала меньше, то переезжаем
    // цена по прежнему выше, то продолжает ехать
    // если выросла цена
    // круг другой, то переезжаем
    // круг тотже, то продолжает ехать
    let row = timeConverter(item.time) + ' ' + i18next.t('history:priceFutures') + ' ' + names[item.type];
    let isDirChange = false;
    let dir = i18next.t('history:notChanged');
    if (item.price < pricesLast[item.type]) {
      dir = i18next.t('history:down');
      if (item.price < pricesLast[circles[item.type]]) {
        isDirChange = true;
        currentType = circles[item.type];
      }
    } else if (item.price > pricesLast[item.type]) {
      dir = i18next.t('history:up');
      if (item.type !== currentType) {
        isDirChange = true;
        currentType = item.type;
      }
    }
    row += ' ' + dir + '!'
    pricesLast[item.type] = item.price;
    if (isDirChange) {
      row += ' ' + i18next.t('history:market') + ' ' + names[address1] +
        ': ' + pricesLast[address1] + ' AIR vs ' + i18next.t('history:market') +
        ' ' + names[address2] + ': ' + pricesLast[address2] + ' AIR. ' +
        i18next.t('history:changeDir') + ' ' + names[currentType] + '.';
    } else {
      row += ' ' + i18next.t('history:lastOrder') + ': ' + item.price + ' AIR. '
        + i18next.t('history:sameDir') + ' ' + names[currentType] + '.';
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
    log,
    video: state.app.video
  }
}
function mapDispatchToProps(dispatch) {
  const actions = bindActionCreators({
    loadModule,
    loadLastPrice,
    load,
    getVideo
  }, dispatch)
  return {
    loadModule: actions.loadModule,
    loadLastPrice: actions.loadLastPrice,
    load: actions.load,
    getVideo: actions.getVideo
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Container))
