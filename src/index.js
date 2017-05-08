import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import routes from './routes'
import storeFactory from './store'
import { fetchRuns } from './actions'


const store = storeFactory
store.dispatch(fetchRuns())

window.React = React
window.store = store

ReactDOM.render(
	<Provider store={store}>
	   {routes}
	</Provider>,
	document.getElementById('root')
)