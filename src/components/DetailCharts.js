import React, { Component } from 'react'


class DetailCharts extends Component {

	constructor(props) {
	    super(props)
	    this.state = {
	    	run: this.props.model
	    }
	    // this.hideSummaryView = this.hideSummaryView.bind(this)
	}

	render() {
		return (
			<div>
				<h1>This is a sample Charts page</h1>
			</div>
		)
	}
}

DetailCharts.propTypes = {
	model: React.PropTypes.object.isRequired
}

export default DetailCharts