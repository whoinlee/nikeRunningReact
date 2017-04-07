import React, { Component } from 'react'
import DetailMap from './DetailMap'
import DetailCharts from './DetailCharts'
import DetailProperties from './DetailProperties'
import '../stylesheets/details.scss'


class DetailsView extends Component {

	constructor(props) {
	    super(props)
	}

	componentWillUnmount() {
		// console.log('INFO DetailsView :: componentWillUnmount')
		if (this.viewContainer) this.viewContainer = null
	}

	render() {
		return (
			<div className="detailsView" ref={(ref) => { this.viewContainer = ref; }}>
				<button 
					className="backButton" 
					id="topBackButton" 
					onClick={this.props.callBack}>Back</button>
				<DetailProperties model={this.props.run}/>
				<DetailCharts model={this.props.run} />
				<DetailMap model={this.props.run} />
				<button 
					className="backButton"  
					id="bottomBackButton" 
					onClick={this.props.callBack}>Back</button>
			</div>
		)
	}
}


DetailsView.propTypes = {
	run: React.PropTypes.object.isRequired,
	id: React.PropTypes.string.isRequired,
	callBack: React.PropTypes.func.isRequired
}

export default DetailsView