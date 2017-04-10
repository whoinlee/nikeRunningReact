import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'

import App from './components/App'
import Whoops404 from './components/Whoops404'
import './stylesheets/index.scss'

window.React = React

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={App} />
		<Route path="/runs" component={App}>
			<Route path=":id" component={App} />
		</Route>
		<Route path="*" component={Whoops404}/>
	</Router>,
	document.getElementById('root')
)