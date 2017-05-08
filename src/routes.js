import React from 'react'
import { Router, IndexRoute, Route, hashHistory } from 'react-router'
import { App, Whoops404 } from './components/index'
import SummaryViewContainer from './components/containers/SummaryViewContainer'
import DetailsViewContainer from './components/containers/DetailsViewContainer'


const routes = (
	<Router history={hashHistory}>
		<Route path="/" component={App} >
			<IndexRoute component={SummaryViewContainer} />
			<Route path="runs" component={DetailsViewContainer}>
				<Route path=":id" component={DetailsViewContainer} />
			</Route>
			<Route path="*" component={Whoops404}/>
		</Route>
	</Router>
)

export default routes 