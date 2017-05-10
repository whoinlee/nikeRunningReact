import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import DetailsView from '../views/DetailsView'
import { clearSelectedRun } from '../../actions'


const mapStateToProps = (state, props) => 
({
	isLoaded: state.isLoaded,
  	run: (state.run) ? state.run : state.runs.find(run => (run.activityId === props.params.id))
})

const mapDispatchToProps = dispatch =>
({
	onBackClick() {
		dispatch(
			clearSelectedRun()
		)
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(DetailsView)