import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import DetailMap from '../ui/DetailMap'
import DetailCharts from '../ui/DetailCharts'
import DetailProperties from '../ui/DetailProperties'
import '../../stylesheets/details.scss'


const DetailsView = ({ isLoaded, run, onBackClick=f=>f }) => {

	const onBackClicked = (e) => {
		console.log("INFO DetailsView :: onBackClicked")

		e.preventDefault()
		hashHistory.push('/')
		onBackClick()
	}

	return (
		<div className="detailsView">
			{
		  		!isLoaded ?
		  		<span>...loading</span> :
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
	isLoaded: React.PropTypes.bool.isRequired,
	run: React.PropTypes.object,
	onBackClick: React.PropTypes.func.isRequired
}

export default DetailsView