import React from 'react'
import ReactDOM from 'react-dom'
import { Router, IndexRoute, Route, hashHistory } from 'react-router'

import App from './components/App'
import SummaryView from './components/SummaryView'
import DetailsView from './components/DetailsView'
import Whoops404 from './components/Whoops404'
import './stylesheets/index.scss'

window.React = React

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={App} >
			<IndexRoute component={SummaryView} />
			<Route path="runs" component={DetailsView}>
				<Route path=":id" component={DetailsView} />
			</Route>
			<Route path="*" component={Whoops404}/>
		</Route>
	</Router>,
	document.getElementById('root')
)