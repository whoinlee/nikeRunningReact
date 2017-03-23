import React, { Component } from 'react'
import { Map, Polyline, TileLayer } from 'react-leaflet'
import '../stylesheets/details.scss'


class DetailMap extends Component {

	constructor(props) {
	    super(props)
	    this.state = {
	    	run: this.props.model,
	    	points: [],
	    	maxZoomLevel: 16,
	    	initZoomLevel: 14,
	    	currentZoomLevel: 14
	    }
	}

	componentDidMount() {
		console.log('INFO DetailMap :: componentDidMount')
		let points = []
		if (this.state.run['gps'] && this.state.run['gps'].waypoints) {
			const waypoints = this.state.run['gps'].waypoints
			points = waypoints.map((waypoint) => [waypoint.latitude, waypoint.longitude])
			// console.log('INFO DetailMap :: points.length is ' + points.length)
			// console.log('INFO DetailMap :: points is ' + points)
			this.setState({points:points})
		}

		/*const leafletMap = this.leafletMap.leafletElement;
    	leafletMap.on('zoomend', () => {
            const updatedZoomLevel = leafletMap.getZoom();
            this.setState({ currentZoomLevel: updatedZoomLevel });
        });*/
	}

	componentWillUnmount() {
		console.log('INFO DetailMap :: componentWillUnmount ever?????')
		this.leafletMap = null
	}

	render() {
		const { points, maxZoomLevel, initZoomLevel } = this.state
		const centerIndex = Math.floor(points.length/2)
		return (
			<div id="map">
				<Map maxZoom={maxZoomLevel} zoom={initZoomLevel} center={points[centerIndex]} ref={m => { this.leafletMap = m; }}>
					<Polyline color='#1788cc' positions={points} />
					<TileLayer 	attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
								url='http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}' />
                </Map>
			</div>
		)
	}
}

DetailMap.propTypes = {
	model: React.PropTypes.object.isRequired
}

export default DetailMap