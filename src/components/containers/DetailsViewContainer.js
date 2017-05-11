import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { setSelectedRun, clearSelectedRun } from '../../actions'
import DetailsView from '../views/DetailsView'


const mapStateToProps = (state, ownProps) => 
({
	isLoaded: state.isLoaded,
  	run: (state.run) ? state.selectedRun : state.runs.find(run => (run.activityId === ownProps.params.id)),
  	router: ownProps.router
})

const mapDispatchToProps = dispatch => 
({
	onBackClick() {
		dispatch(
			clearSelectedRun()
		)
	}
})

const DetailsViewContainer = connect(mapStateToProps, mapDispatchToProps)(DetailsView)
export default withRouter(DetailsViewContainer)