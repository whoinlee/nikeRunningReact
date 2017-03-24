import React, { Component } from 'react'
import _ from 'underscore'
import $ from 'jquery'
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
	    	elevationLegend: {}
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
			// console.log('INFO DetailCharts :: dist.length is ' + dist.length)


			//-- time :: an array of time intervals with step 10
			const interval = parseInt(metrics[0].intervalMetric, 10)			//radix:10, i.e. decimal number
            let time = _.range(0, interval*metrics[0].values.length, interval) 	//array, (start, stop, step)
            this.state.time = time
            // console.log('INFO DetailCharts :: calculateMetrics, time.length is ' + time.length)


            //-- timeTicks :: an array of tick marks on the x-axis w. max 8 marks
            /* calculate tick marks manually to ensure precise alignment and reasonable values,
             * rounded to some integer multiple of 5-minute values. */
            const maxTime = Math.max.apply(null, time)
            const tickCount = Math.floor(maxTime/300)	//300sec, i.e. 5min
            const tickScale = Math.ceil(tickCount/8)*5
            let timeTicks = _.range(tickScale*60, Math.floor(maxTime/tickScale)*tickScale, tickScale*60)	//array
            timeTicks = timeTicks.map((t) => (
                (t < 3600) ? 
                [t, t/60 + ':00'] :
                [t, Math.floor(t/3600) + ':' + ((t%3600)/60 + '').padStart(2, '0') + ':00']))
            this.state.timeTicks = timeTicks
            // console.log('INFO DetailCharts :: timeTicks.length is ' + timeTicks.length)
            

            //-- pace :: an array of pace calculated w. time and distance
            let pace = dist && dist.map((pt, idx) => (
                    ((idx === 0) || (dist[idx] === dist[idx-1])) ?
                    null :
                    interval / (60* (dist[idx] - dist[idx-1]))
                ))
            pace = pace && pace.map((pt) => ( ((pt > 4) && (pt < 20)) ? pt : null ))	//eliminate any outliers
            this.state.pace = pace
            // console.log('INFO DetailCharts :: calculateMetrics, pace.length is ' + pace.length)


            //-- heartrate :: an array of heartrate   
            /* Heart rate may be available, but it's not guaranteed.
             * It's also subject to dropouts where there is no value recorded. We'll filter those out of our data.*/
            let heartrate = metrics.find((metric) => (metric.metricType.toUpperCase() === 'HEARTRATE'))
            heartrate = heartrate && (heartrate.values).map((value, idx) => (parseInt(value,10) || null))
            this.state.heartrate = heartrate

            /*
             * Elevation will be available only if there is GPS data. If
             * it's there, let's grab it and convert meters to feet while
             * we're at it.
             */
            const gps = this.state.run['gps']
            let elevation = gps && gps.waypoints &&
                            _(gps.waypoints)
                                .chain()
                                .pluck('elevation')						//pluck: extracting a list of property values
                                .map((pt) => 3.28084*parseFloat(pt))	//convert to feet
                                .value()

            // console.log('INFO DetailCharts :: elevation is ' + elevation)
            // console.log('INFO DetailCharts :: calculateMetrics, elevation.length is ' + elevation.length)

            /*
             * At least right now, there's a bit of a bug in Nike's
             * response for GPS data. It claims that the measurements
             * are on the same time scale as the other metrics (every
             * 10 seconds), but, in fact, the GPS measurements are
             * reported on different intervals. To work around this bug, we
             * ignore the reported interval, and calculate one ourselves.
             * Also, we want to normalize the elevation graph to the
             * same time scale as all the others. Doing that will give
             * us the additional benefit of averaging the GPS elevation
             * data; averaging is useful here because GPS elevation
             * measurements aren't generally very accurate.
             */

            const gpsRatio = elevation && (elevation.length / time.length);
            elevation = elevation && _(time).map((pt, idx) => {
                /*
                 * Create an array that specifies the elevation points
                 * we're going to average for this value.
                 */
                let range = _.range( Math.round(Math.max(gpsRatio*idx-gpsRatio/2, 0)),
                    				 Math.round(Math.min(gpsRatio*idx+gpsRatio/2, elevation.length)) )
                /*
                 * Return the average of the selected points.
                 */
                return _(range).reduce((avg,idx,cnt) => ((avg*cnt + elevation[idx]) / (cnt+1)), 0)
            })
            // this.setState({elevation: elevation})
            this.state.elevation = elevation
		}//if

		let options = {
                legend: {show: false},
                series: {lines: {fill: false, lineWidth: 2}, shadowSize: 1},
                xaxis:  {show: true, min: 0, max: Math.max.apply(null, this.state.time), ticks: this.state.timeTicks, labelHeight: 0, autoscaleMargin: 0, tickFormatter: function() {return ''}},   
                yaxis:  {show: false},
                grid:   {show: true, borderWidth: 0, borderColor: null, margin: 0, labelMargin: 0, axisMargin: 0, minBorderMargin: 0, hoverable: true, autoHighlight: false},
        }
        // this.setState({options: options})
        this.state.options = options
	}

	renderPaceChart() {
		const pace = this.state.pace
        const time = this.state.time
        const options = this.state.options

		let plot = {},
		 	chartDiv = this.chartDiv,
		 	chartPace = this.chartPace

		if (pace.length > 0) {
            plot.placeholder = chartPace
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

        let plot = {},
            chartDiv = this.chartDiv,
            chartHeartrate = this.chartHeartrate

        if (heartrate.length > 0) {
            plot.placeholder = chartHeartrate
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

        let plot = {},
            chartDiv = this.chartDiv,
            chartElevation = this.chartElevation

        if (elevation.length > 0) {
            plot.placeholder = chartElevation
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
        const options = this.state.options

        let plot = {},
            chartDiv = this.chartDiv,
            chartTick = this.chartTick

        plot.placeholder = chartTick
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

    drawGraphcs() {
        /*
         * Iterate through all the plots we created and draw them.
         */
         
        // _(this.plots).each(function(plot) {
        //     /* call the flot library to draw the graph */
        //     plot.plot = $.plot(plot.placeholder, [plot.data], plot.options);
        //     /* also create a moving legend to show a value */
        //     plot.value = $('<div>').css({
        //         'position':  'absolute',
        //         'top':       plot.placeholder.position().top + 'px',
        //         'display':   'none',
        //         'z-index':   1,
        //         'font-size': '11px',
        //         'color':     'black'
        //     });
        //     this.$el.append(plot.value);
        // }, this);

        // /*
        //  * Now prepare to handle hover events on the charts.
        //  */
        // var self = this;
        // this.$el.find('.charts-graphs').on('plothover', function(ev, pos) {
        //     /* figure out where to position the sliding marker */
        //     var xvalue = Math.round(pos.x/10);
        //     var left = _(self.plots).last().plot.pointOffset(pos).left;
        //     var height = self.$el.find('.charts-graphs').height() - 15;
        //     /* position the marker and turn it on */
        //     self.$el.find('.charts-marker').css({
        //         'top':    0,
        //         'left':   left,
        //         'width':  '1px',
        //         'height': height
        //     }).show();
        //     //go through each chart and show it's value at the cursor 
        //     _(self.plots).each(function(plot){
        //         if ((xvalue >= 0) && (xvalue < plot.data.length)) {
        //             $(plot.value).text(plot.format(plot.data[xvalue][1])).css('left', (left+4)+'px').show();
        //         }
        //     });
        // // turn off the marker and values when the mouse leaves 
        // }).on('mouseout', function(ev) {
        //     if (ev.relatedTarget.className !== 'charts-marker') {
        //         self.$el.find('.charts-marker').hide();
        //         _(self.plots).each(function(plot) { plot.value.hide(); });
        //     }
        // });
        // // also turn off things if the mouse leaves from the marker itself
        // self.$el.find('.charts-marker').on('mouseout', function(ev) {
        //     self.$el.find('.charts-marker').hide();
        //     _(self.plots).each(function(plot) { plot.value.hide(); });
        // });
    }

	render() {
		const { dist, time, timeTicks, pace, heartrate, elevation, paceLegend, heartrateLegend, elevationLegend } = this.state
		return (
			<div className="charts-wrapper">
				<div className="charts-marker">
                </div>
		        <div className="charts-graphs" ref={(ref) => { this.chartDiv = ref; }}>
		        	<figure ref={(ref) => { this.chartPace = ref; }}>
		        	</figure>
		        	<figure ref={(ref) => { this.chartHeartrate = ref; }}>
		        	</figure>
		        	<figure ref={(ref) => { this.chartElevation = ref; }}>
		        	</figure>
                    <div 
                        className="x-axis" 
                        ref={(ref) => { this.chartTick = ref; }}>
                    </div>
		        </div>
		        <div className="charts-legend" ref={(ref) => { this.chartLegend = ref; }}>
		        	<div>
		        		<p><strong>Pace</strong></p>
		        		<p>Slowest: {paceLegend.max} per Mile</p>
		        		<p>Average: {paceLegend.mean} per Mile</p>
		        		<p>Fastest: {paceLegend.min} per Mile</p>
		        	</div>
                    <div>
                        <p><strong>Heart Rate</strong></p>
                        <p>Minimum: {heartrateLegend.min} bpm</p>
                        <p>Average: {heartrateLegend.mean} bpm</p>
                        <p>Maximum: {heartrateLegend.max} bpm</p>
                    </div>
                    <div>
                        <p><strong>Elevation</strong></p>
                        <p>Minimum: {elevationLegend.min} ft</p>
                        <p>Average: {elevationLegend.mean} ft</p>
                        <p>Maximum: {elevationLegend.max} ft</p>
                    </div>
		        </div>
			</div>
		)
	}
}

DetailCharts.propTypes = {
	model: React.PropTypes.object.isRequired
}

export default DetailCharts