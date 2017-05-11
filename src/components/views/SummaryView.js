import React from 'react'
import PropTypes from 'prop-types'
import SummaryRow from '../ui/SummaryRow'
import '../../stylesheets/summary.scss'


const SummaryView = ({ isLoaded, runs, router, onSelectRun=f=>f }) => {

	const onSummaryClicked = (id, run) => {
		router.push('/runs/' + id)
		onSelectRun(run)
	}

  	return (
	  	<div className="summaryView" >
	  		{
	  			!isLoaded ?
	  			<span>...loading</span> :
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
			}
		</div>
	)
}  

SummaryView.propTypes = {
	isLoaded: PropTypes.bool.isRequired,
	runs: (props) => (props.isLoaded && !Array.isArray(props.runs)) ?
						new Error("summary data(runs) should be an array") :
						(props.isLoaded && !props.runs.length) ?
			            	new Error("summary data(runs) array must contain at least one record") :
			          		null,
	onSelectRun: PropTypes.func.isRequired,
	router: PropTypes.object
}

export default SummaryView