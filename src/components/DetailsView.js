import React, { Component } from 'react'

import DetailProperties from './DetailProperties'
import DetailCharts from './DetailCharts'
import DetailMap from './DetailMap'
import '../stylesheets/details.scss'


class DetailsView extends Component {

	constructor(props) {
	    super(props)
	}

	componentWillUnmount() {
		console.log('INFO DetailsView :: componentWillUnmount ever?????')
		if (this.detailsView) this.detailsView = null
	}

	render() {
		return (
			<div className='detailsView' ref={container => { this.detailsView = container; }}>
				<button onClick={this.props.callBack}>Back</button>
				<DetailMap model={this.props.run}/>
				<DetailCharts model={this.props.run}/>

				
				<button onClick={this.props.callBack}>Back</button>
			</div>
		)
	}
}

//				<DetailProperties model={this.props.run}/>

DetailsView.propTypes = {
	run: React.PropTypes.object.isRequired,
	id: React.PropTypes.string.isRequired,
	callBack: React.PropTypes.func
}

export default DetailsView