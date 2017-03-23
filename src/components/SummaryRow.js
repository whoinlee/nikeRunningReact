import React from 'react'
import moment from 'moment'


export const SummaryRow = ({run, callBack}) => {

	let time=moment(run['startTime']).calendar(),
		duration=run['metricSummary'].duration,
  		distance=run['metricSummary'].distance,
  		calories=run['metricSummary'].calories,
  		id=run['activityId']

	const onRowClicked = (e) => {
		console.log("INFO SummaryRow :: onRowClicked, id is " + id)
		e.preventDefault()
		callBack(id)
	}

	return (
		<tr onClick={onRowClicked} >
			<td>{time}</td>
			<td>{duration}</td>
			<td>{distance}</td>
			<td>{calories}</td>
		</tr>
	)			
}

SummaryRow.propTypes = {
	run: React.PropTypes.object.isRequired,
	callBack: React.PropTypes.func
}

export default SummaryRow