import React, { Component } from 'react'
import history from '../history'
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
	    history.push({
	    	pathname: window.location
	    })
	    console.log("window.location:" + window.location)
	}

	hideSummaryView(id) {
		// console.log("INFO SummaryView :: hideSummaryView, id is " + id)
		this.setState({hide:true})
		this.props.callBack(id)
	}

	render() {
		const { runs, hide } = this.state
	  	return (
		  	<div className="summaryView" style={hide ? { display: 'none' } : {}} >
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
						{runs.map( (run, i) => <SummaryRow key={"id" + i} run={run} callBack={this.hideSummaryView} /> )}
					</tbody>
				</table>
			</div>
		)
	}
}  

SummaryView.propTypes = {
	runs: (props) => (	(!Array.isArray(props.runs)) ?
						Error("summary data should be an array") : null	),
	callBack: React.PropTypes.func.isRequired
}

export default SummaryView