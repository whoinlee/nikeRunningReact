import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { clearSelectedRun } from '../../actions'
import DetailsView from '../views/DetailsView'


const getSelectedRun = (state, id) => 
	state.selectedRun || state.runs.find(run => (run.activityId === id))

const mapStateToProps = (state, ownProps) => 
({
	isLoaded: state.isLoaded,
  	run: getSelectedRun(state, ownProps.params.id),
  	router: ownProps.router
})

const DetailsViewContainer = connect(mapStateToProps, { clearSelectedRun })(DetailsView)
export default withRouter(DetailsViewContainer)