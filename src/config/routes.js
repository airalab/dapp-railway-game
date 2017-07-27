import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from '../shared/containers/app'
import NotFound from '../shared/components/app/notFound'
import * as Board from '../routes/board'
import * as Market from '../routes/market'
import * as MarketLiability from '../routes/marketLiability'
import * as Estimator from '../routes/estimator'

export const routes = () =>
  (<div>
    <Route path="/" component={App}>
      <IndexRoute component={Board.Main} />
      <Route path="/market/:address" component={Market.Page}>
        <IndexRoute component={Market.Main} />
      </Route>
      <Route path="/market-liability" component={MarketLiability.Page}>
        <IndexRoute component={MarketLiability.Main} />
      </Route>
      <Route path="/estimator" component={Estimator.Page}>
        <IndexRoute component={Estimator.Main} />
      </Route>
    </Route>
    <Route path="*" component={NotFound} />
  </div>)
