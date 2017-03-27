import React from 'react'
import ReactDOM from 'react-dom'

// import { Router, Route, hashHistory } from 'react-router'
// import router from './router'
import history from './history'
import router from './router'

import App from './components/App'
import './stylesheets/index.scss'



window.React = React



renderComponent = () => {
	ReactDOM.render(<App />, document.getElementById('root'));
}

render = (location) => {
	router.resolve(routes, location)
    .then(renderComponent)
	.catch(error => router.resolve(routes, { ...location, error }).then(renderComponent));
}

history.listen(render);
render(history.location);




// render(
// 	<App />, 
// 	document.getElementById('root')
// )

/*
	<Router history={hashHistory}>
		<Route path="/" component={App}/>
		<Route path="/runs/:id" component={App}/>
	</Router>,
*/