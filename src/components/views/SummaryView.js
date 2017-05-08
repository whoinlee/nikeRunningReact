import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import SummaryRow from '../ui/SummaryRow'
import '../../stylesheets/summary.scss'


const SummaryView = ({ runs, onSelectRun=f=>f }) => {

	const onSummaryClicked = (id, run) => {
		console.log("INFO SummaryView :: onSummaryClicked, id is " + id)

		hashHistory.push('/runs/' + id)
		onSelectRun(run)
	}

  	return (
	  	<div className="summaryView" >
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
					{runs.map((run, i) =>
						<SummaryRow key={"row" + i}
									run={run}
									onRowClick={onSummaryClicked}
						/> 
					)}
				</tbody>
			</table>
		</div>
	)
}  

SummaryView.propTypes = {
	runs: (props) => (!Array.isArray(props.runs)) ?
					new Error("summary data(runs) should be an array") :
					(!props.runs.length) ?
			            new Error("summary data(runs) array must contain at least one record") :
			            null,
	onSelectRun: React.PropTypes.func.isRequired
}

export default SummaryView