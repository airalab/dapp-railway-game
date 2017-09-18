import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'
import { I18nextProvider } from 'react-i18next';
import hett from 'hett'
import configureStore from './config/store'
import { routes } from './config/routes'
import i18n from './config/i18n';
import { ProviderAbi, getNetworkName } from './utils/helper'
import * as abis from './abi'
import DepNetwork from './shared/components/app/depNetwork'

hett.init(web3, new ProviderAbi(abis));

const store = configureStore()

getNetworkName()
  .then((network) => {
    if (network === 'kovan') {
      render(
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <Router history={hashHistory} routes={routes(store)} />
          </Provider>
        </I18nextProvider>,
        document.getElementById('root')
      )
    } else {
      render(
        <DepNetwork />,
        document.getElementById('root')
      )
    }
  })
