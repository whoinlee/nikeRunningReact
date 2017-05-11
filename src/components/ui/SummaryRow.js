import React from 'react'
import moment from 'moment'
import '../../stylesheets/summary.scss'


const SummaryRow = ({run, onRowClick}) => {

	let time=moment(run['startTime']).calendar(),
		duration=run['metricSummary'].duration,
  		distance=run['metricSummary'].distance,
  		calories=run['metricSummary'].calories,
  		id=run['activityId']

	const onRowClicked = (e) => {
		// console.log("INFO SummaryRow :: onRowClicked, id is " + id)
		e.preventDefault()
		onRowClick(id, run)
	}

	return (
		<tr onClick={onRowClicked}>
			<td>{time}</td>
			<td>{duration}</td>
			<td>{distance}</td>
			<td>{calories}</td>
		</tr>
	)			
}

SummaryRow.propTypes = {
	run: React.PropTypes.object.isRequired,
	onRowClick: React.PropTypes.func.isRequired
}

export default SummaryRow