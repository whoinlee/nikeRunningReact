import React, { Component } from 'react'
import _ from 'underscore'
import '../stylesheets/detailCharts.scss'

class DetailCharts extends Component {

	constructor(props) {
	    super(props)
	    this.state = {
	    	run: this.props.model,
	    	plots: [],
	    	dist: [],
	    	time: [],
	    	timeTicks: [],
	    	pace: [],
	    	heartrate: [],
	    	elevation: [],
	    	options: {},
	    	paceLegend: {},
	    	heartrateLegend: {},
	    	elevationLegend: {},
            hover: false,
            markerStyle: {top: '0px', left: '0px'}
	    }
	    this.calculateMetrics = this.calculateMetrics.bind(this)
	    this.renderPaceChart = this.renderPaceChart.bind(this)
	    this.renderHeartRateChart = this.renderHeartRateChart.bind(this)
        this.renderElevationChart = this.renderElevationChart.bind(this)
        this.renderTickChart = this.renderTickChart.bind(this)
	    this.drawGraphs = this.drawGraphs.bind(this)
	}

	componentDidMount() {
		// console.log('INFO DetailCharts :: componentDidMount')
		this.calculateMetrics()
		this.renderPaceChart()
		this.renderHeartRateChart()
		this.renderElevationChart()
        this.renderTickChart()
        this.drawGraphs()
	}

	calculateMetrics() {
        // console.log('INFO DetailCharts :: calculateMetrics')
		if (this.state.run['metrics']) {
			//-- an array of objects
			const metrics = this.state.run['metrics']

			//-- dist :: an array of distance values converted to miles
			let dist = metrics.find((metric) => (metric.metricType.toUpperCase() === 'DISTANCE'))
			dist = dist && (dist.values).map((value) => (parseFloat(value) * 0.621371))  //convert to miles
			this.state.dist = dist

			//-- time :: an array of time intervals with step 10
			const interval = parseInt(metrics[0].intervalMetric, 10)			//radix:10, i.e. decimal number
            let time = _.range(0, interval*metrics[0].values.length, interval) 	//array, (start, stop, step)
            this.state.time = time

            //-- timeTicks :: an array of tick marks on the x-axis w. max 8 marks
            /* rounded to some integer multiple of 5-minute values. */
            const maxTime = Math.max.apply(null, time)
            const tickCount = Math.floor(maxTime/300)	//300sec, i.e. 5min
            const tickScale = Math.ceil(tickCount/8)*5
            let timeTicks = _.range(tickScale*60, Math.floor(maxTime/tickScale)*tickScale, tickScale*60)	//array
            timeTicks = timeTicks.map((t) => (
                (t < 3600) ? 
                [t, t/60 + ':00'] :
                [t, Math.floor(t/3600) + ':' + ((t%3600)/60 + '').padStart(2, '0') + ':00']))
            this.state.timeTicks = timeTicks
            
            //-- pace :: an array of pace calculated w. time and distance
            let pace = dist && dist.map((pt, idx) => (
                    ((idx === 0) || (dist[idx] === dist[idx-1])) ?
                    null :
                    interval / (60* (dist[idx] - dist[idx-1]))
                ))
            pace = pace && pace.map((pt) => ( ((pt > 4) && (pt < 20)) ? pt : null ))	//eliminate any outliers
            if (pace) this.state.pace = pace

            //-- heartrate :: an array of heartrate   
            /* Heart rate may be available, but it's not guaranteed.
             * It's also subject to dropouts where there is no value recorded. We'll filter those out of our data.*/
            let heartrate = metrics.find((metric) => (metric.metricType.toUpperCase() === 'HEARTRATE'))
            heartrate = heartrate && (heartrate.values).map((value, idx) => (parseInt(value,10) || null))
            if (heartrate) this.state.heartrate = heartrate

            //-- elevation
            /*Elevation will be available only if there is GPS data. */
            const gps = this.state.run['gps']
            let elevation = gps && gps.waypoints &&
                            _(gps.waypoints)
                                .chain()
                                .pluck('elevation')						//pluck: extracting a list of property values
                                .map((pt) => 3.28084*parseFloat(pt))	//convert to feet
                                .value()

            /* At least right now, there's a bit of a bug in Nike's
             * response for GPS data. It claims that the measurements
             * are on the same time scale as the other metrics (every
             * 10 seconds), but, in fact, the GPS measurements are
             * reported on different intervals. To work around this bug, we
             * ignore the reported interval, and calculate one ourselves.
             * Also, we want to normalize the elevation graph to the
             * same time scale as all the others. Doing that will give
             * us the additional benefit of averaging the GPS elevation
             * data; averaging is useful here because GPS elevation
             * measurements aren't generally very accurate.  */
            const gpsRatio = elevation && (elevation.length / time.length);
            elevation = elevation && _(time).map((pt, idx) => {
                
                /* Create an array that specifies the elevation points
                 * we're going to average for this value. */
                let range = _.range( Math.round(Math.max(gpsRatio*idx-gpsRatio/2, 0)),
                    				 Math.round(Math.min(gpsRatio*idx+gpsRatio/2, elevation.length)) )
                
                /* Return the average of the selected points. */
                return _(range).reduce((avg,idx,cnt) => ((avg*cnt + elevation[idx]) / (cnt+1)), 0)
            })
            if (elevation) this.state.elevation = elevation
		}//if

		let options = {
                legend: {show: false},
                series: {lines: {fill: false, lineWidth: 2}, shadowSize: 1},
                xaxis:  {show: true, min: 0, max: Math.max.apply(null, this.state.time), ticks: this.state.timeTicks, labelHeight: 0, autoscaleMargin: 0, tickFormatter: function() {return ''}},   
                yaxis:  {show: false},
                grid:   {show: true, borderWidth: 0, borderColor: null, margin: 0, labelMargin: 0, axisMargin: 0, minBorderMargin: 0, hoverable: true, autoHighlight: false},
        }
        this.state.options = options
	}

	renderPaceChart() {
		const pace = this.state.pace
        const time = this.state.time
        const options = this.state.options

		if (pace.length > 0) {
            let plot = {}
            plot.placeholder = this.chartPace
            plot.valueHolder = this.paceValue
            plot.valueStyle = {position: 'absolute', top: '0px', left: '0px', display: 'none', zIndex: 1, fontSize: '11px', color: 'black'}
            plot.data = _.zip(time, pace)
            plot.options = _({}).extend(options, {
                yaxis:  {show: false, min: 0, max: 1.2*Math.max.apply(null, pace)},
                series: {lines: {fill: true, fillColor: '#9fceea', lineWidth: 1}, shadowSize: 0},
                colors: ['#1788cc'],
            })
            plot.format = ((val) => (
                (!_(val).isFinite()) ?
                	'' : 
                	Math.floor(val)  + ':' + (Math.round((val % Math.floor(val))*60) + '').padStart(2, '0') + ''
            ))

            this.state.plots.push(plot)
            
            //-- legend
            let clean, min, max, mean, paceLegend
            clean = _(pace).chain()
                .filter((pt) => _(pt).isFinite())
                .reject((pt) => (pt === 0))
                .value()
            min = Math.min.apply(null, clean)
            max = Math.max.apply(null, clean)
            mean = _(clean).reduce((sum, pt) => (sum+pt), 0)/clean.length
            paceLegend = { min:plot.format(min), max:plot.format(max), mean:plot.format(mean) }
            this.setState({paceLegend: paceLegend})
        }
	}

	renderHeartRateChart() {
        const heartrate = this.state.heartrate
        const time = this.state.time
        const options = this.state.options

        if (heartrate.length > 0) {
            let plot = {}
            plot.placeholder = this.chartHeartrate
            plot.valueHolder = this.heartrateValue
            plot.valueStyle = {position: 'absolute', top: '100px', left: '0px', display: 'none', zIndex: 1, fontSize: '11px', color: 'black'}
            plot.data = _.zip(time, heartrate);
            plot.options = _({}).extend(options, {
                yaxis:  {show: false, min: 0, max: 1.2*Math.max.apply(null, heartrate)},
                series: {lines: {fill: true, fillColor: '#eaaa9f', lineWidth: 1}, shadowSize: 0},
                colors: ['#cc3217'],
            })
            plot.format = ((val) => (
                (!_(val).isFinite() || (val === 0)) ?
                   '' : Math.round(val)
            ))
            this.state.plots.push(plot)

            //-- legend
            let clean, min, max, mean, heartrateLegend
            clean = _(heartrate).chain()
                .filter((pt) => _(pt).isFinite())
                .reject((pt) => (pt === 0))
                .value()
            min = Math.min.apply(null, clean)
            max = Math.max.apply(null, clean)
            mean = _(clean).reduce((sum, pt) => (sum+pt), 0)/clean.length
            heartrateLegend = { min:plot.format(min), max:plot.format(max), mean:plot.format(mean) }
            this.setState({heartrateLegend: heartrateLegend})
        }
	}
	
	renderElevationChart() {
        const elevation = this.state.elevation
        const time = this.state.time
        const options = this.state.options

        if (elevation.length > 0) {
            let plot = {}
            plot.placeholder = this.chartElevation
            plot.valueHolder = this.elevationValue
            plot.valueStyle = {position: 'absolute', top: '200px', left: '0px', display: 'none', zIndex: 1, fontSize: '11px', color: 'black'}
            plot.data = _.zip(time, elevation)

            let min, max, mean, range

            min = Math.min.apply(null,elevation)
            max = Math.max.apply(null,elevation)
            range = max - min;
            min -= 0.2*range
            max += 0.2*range

            plot.options = _({}).extend(options, {
                yaxis:  {show: false, min: min, max: max},
                series: {lines: {fill: true, fillColor: '#ead19f', lineWidth: 1}, shadowSize: 0},
                colors: ['#cc9117'],
            })
            plot.format = ((val) => (
                (!_(val).isFinite()) ?
                   '' : Math.round(val)
            ))
            this.state.plots.push(plot)

            //-- legend
            min = Math.min.apply(null, elevation)
            max = Math.max.apply(null, elevation)
            mean = _(elevation).reduce((sum, pt) => (sum+pt), 0)/elevation.length
            let elevationLegend = { min:plot.format(min), max:plot.format(max), mean:plot.format(mean) }
            this.setState({elevationLegend: elevationLegend})
        }
	}

    renderTickChart() {
        const timeTicks = this.state.timeTicks
        const time = this.state.time
        const options = this.state.options

        let plot = {}
        plot.placeholder = this.chartTick
        plot.valueHolder = this.tickValue
        plot.valueStyle = {position: 'absolute', top: '300px', left: '0px', display: 'none', zIndex: 1, fontSize: '11px', color: 'black'}
        plot.data = _(time).map((t) => ([t, null]))
        plot.options = _({}).extend(options, {
            xaxis:  {
                show: true,
                min: 0,
                max: Math.max.apply(null, time),
                ticks: timeTicks,
                labelHeight: 12,
                autoscaleMargin: 0,
            },
            yaxis:  {show: false, min: 100, max: 200},
            grid:   {show: true, borderWidth: 0, margin: 0, labelMargin: 0, axisMargin: 0, minBorderMargin: 0},
        })
        plot.format = ((val) => (''))
        this.state.plots.push(plot)
    }

    drawGraphs() {
        const { plots } = this.state

        //-- draw graphs
        plots.forEach((plot) => {
            plot.plot = jQuery.plot(plot.placeholder, [plot.data], plot.options)
        })

        //-- show/hide marker & its values on mouseover/mouseout
        let self = this
        let chartGraphs = this.chartGraphs
        let chartMarker = this.chartMarker
        const markerHeight = $(chartGraphs).height() - 15
        $(chartGraphs).on('plothover', function(ev, pos) {
            let xvalue = Math.round(pos.x/10)
            let left = _(plots).last().plot.pointOffset(pos).left
            self.setState({hover: true, markerStyle: {top: '0px', left: left + 'px', width: '1px', height: markerHeight + 'px'}}) //--> trigger rendering
            $(chartMarker).show()
            //-- show value for each graph
            plots.forEach((plot) => {
                if (xvalue && (xvalue >= 0) && (xvalue < plot.data.length)) {
                    plot.valueStyle.left = (left+4)+'px'
                    $(plot.valueHolder).text(plot.format(plot.data[xvalue][1])).show()
                }
            })
        }).on('mouseout', function(ev) {
            if (ev.relatedTarget && (ev.relatedTarget.className !== 'charts-marker')) {
                self.setState({hover: false})   //--> trigger rendering
                $(chartMarker).hide()
                plots.forEach((plot) => {
                    $(plot.valueHolder).hide()
                })
            }
        })
        $(chartMarker).on('mouseout', function(ev) {
            $(chartMarker).hide()
            plots.forEach((plot) => {
                $(plot.valueHolder).hide()
            })
        })
    }

	render() {
		const { plots, dist, time, timeTicks, pace, heartrate, elevation, paceLegend, heartrateLegend, elevationLegend, markerStyle } = this.state
		return (
			<div id="charts" className="charts-wrapper" ref={(ref) => { this.chartWrapper = ref; }}>
				<div className="charts-marker" style={markerStyle} ref={(ref) => { this.chartMarker = ref; }}>
                </div>
		        <div className="charts-graphs" ref={(ref) => { this.chartGraphs = ref; }}>
                    <figure 
                        ref={(ref) => { this.chartPace = ref; }}>
                    </figure>
                    <figure 
                        ref={(ref) => { this.chartHeartrate = ref; }}>
                    </figure>
                    <figure 
                        ref={(ref) => { this.chartElevation = ref; }}>
                    </figure>
                    <div 
                        className="x-axis" 
                        ref={(ref) => { this.chartTick = ref; }}>
                    </div>
		        </div>
		        <div className="charts-legend" ref={(ref) => { this.chartLegend = ref; }}>
		        	<div style={ (pace.length>0) ? { display: 'block' } : {display: 'none'}}>
		        		<p><strong>Pace</strong></p>
		        		<p>Slowest: {paceLegend.max} per Mile</p>
		        		<p>Average: {paceLegend.mean} per Mile</p>
		        		<p>Fastest: {paceLegend.min} per Mile</p>
		        	</div>
                    <div style={ (heartrate.length>0) ? { display: 'block' } : {display: 'none'}}>
                        <p><strong>Heart Rate</strong></p>
                        <p>Minimum: {heartrateLegend.min} bpm</p>
                        <p>Average: {heartrateLegend.mean} bpm</p>
                        <p>Maximum: {heartrateLegend.max} bpm</p>
                    </div>
                    <div style={ (elevation.length>0) ? { display: 'block' } : {display: 'none'}}>
                        <p><strong>Elevation</strong></p>
                        <p>Minimum: {elevationLegend.min} ft</p>
                        <p>Average: {elevationLegend.mean} ft</p>
                        <p>Maximum: {elevationLegend.max} ft</p>
                    </div>
		        </div>
                <div 
                    style={(plots && plots[0])? plots[0].valueStyle : {position: 'absolute', left: '0px', top: '0px', zIndex: 1}}
                    ref={(ref) => { this.paceValue = ref; }}></div>
                <div 
                    style={(plots && plots[1])? plots[1].valueStyle : {position: 'absolute', left: '0px', top: '100px', zIndex: 1}}
                    ref={(ref) => { this.heartrateValue = ref; }}></div>
                <div 
                    style={(plots && plots[2])? plots[2].valueStyle : {position: 'absolute', left: '0px', top: '200px', zIndex: 1}}
                    ref={(ref) => { this.elevationValue = ref; }}></div>
                <div 
                    style={(plots && plots[3])? plots[3].valueStyle : {position: 'absolute', left: '0px', top: '300px', zIndex: 1}}
                    ref={(ref) => { this.tickValue = ref; }}>
                </div>
			</div>
		)
	}
}


DetailCharts.propTypes = {
	model: React.PropTypes.object.isRequired
}

export default DetailCharts