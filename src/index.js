import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'

import App from './components/App'
import './stylesheets/index.scss'


window.React = React

render(
	<Router history={hashHistory}>
		<Route path="/" component={App}/>
		<Route path="runs" component={App}/>
	</Router>,
	document.getElementById('root')
)