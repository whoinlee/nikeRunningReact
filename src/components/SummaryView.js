import React, { Component } from 'react'

import SummaryRow from './SummaryRow'
import '../stylesheets/summary.scss'


class SummaryView extends Component {

	constructor(props) {
	    super(props)
	    this.state = {
	    	runs: this.props.runs,
	      	hide:false
	    }
	    this.hideSummaryView = this.hideSummaryView.bind(this)
	}

	hideSummaryView(id) {
		console.log("INFO SummaryView :: hideSummaryView, id is " + id)
		this.setState({hide:true})
		this.props.callBack(id)
	}

	render() {
		const { runs, hide } = this.state
	  	return (
		  	<div className='summaryView' style={hide ? { display: 'none' } : {}} >
				<table>
					<thead>
						<tr>
							<th>Time</th>
				            <th>Duration</th>
				            <th>Distance</th>
				            <th>Calories</th>
						</tr>
					</thead>
					<tbody>
						{runs.map( (run, i) => <SummaryRow key={i} run={run} callBack={this.hideSummaryView}/> )}
					</tbody>
				</table>
			</div>
		)
	}
}  

SummaryView.propTypes = {
	runs: function(props) {
		if (!Array.isArray(props.runs)) {
			return new Error("summary data should be an array")
		// } else if(!props.runs.length) {
		// 	return new Error("There should be at least one record")
		} else {
			return null
		}
	},
	callBack: React.PropTypes.func
}

export default SummaryView