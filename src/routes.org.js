import React from 'react'
import { Router, IndexRoute, Route, hashHistory } from 'react-router'

// import App from './components/App'
// import Whoops404 from './components/Whoops404'
import { App, Whoops404 } from './components'
import SummaryView from './components/containers/SummaryViewContainer'
import DetailsView from './components/containers/DetailsViewContainer'
// import SummaryView from './components/views/SummaryView'
// import DetailsView from './components/views/DetailsView'

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