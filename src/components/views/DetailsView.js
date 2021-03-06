import React from 'react'
import PropTypes from 'prop-types'
import DetailMap from '../ui/DetailMap'
import DetailCharts from '../ui/DetailCharts'
import DetailProperties from '../ui/DetailProperties'
import '../../stylesheets/details.scss'


const DetailsView = ({ isLoaded, run, router, clearSelectedRun }) => {

	const onBackClicked = (e) => {
		e.preventDefault()
		router.push('/')
		clearSelectedRun()
	}
	
	return (
		<div className="detailsView">
			{
		  		!isLoaded ?
		  		<div id="loading">...loading</div> :
		  		<div>
					<button 
						className="backButton" 
						id="topBackButton" 
						onClick={onBackClicked}>Back</button>
					<DetailProperties model={run} />
					<DetailCharts model={run} />
					<DetailMap model={run} />
					<button 
						className="backButton"  
						id="bottomBackButton" 
						onClick={onBackClicked}>Back</button>
				</div>
			}
		</div>
	)
}

DetailsView.propTypes = {
	isLoaded: PropTypes.bool.isRequired,
	run: PropTypes.object,
	clearSelectedRun: PropTypes.func.isRequired,
	router: PropTypes.object
}

export default DetailsView