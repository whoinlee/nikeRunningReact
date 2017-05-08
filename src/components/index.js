import '../stylesheets/index.scss'


export const App = ({children}) =>
    <div className="app">
    	<div className="appHeader">
            <h2>A Sample Data Visualization w. Nike+ API data, built with React</h2>
        </div>
        {children}
    </div>


export const Whoops404 = ({ location }) =>
    <div>
        <h1>Whoops, route not found</h1>
        <p>Cannot find content for {location.pathname}</p>
    </div>