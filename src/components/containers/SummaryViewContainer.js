import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { setSelectedRun } from '../../actions'
import SummaryView from '../views/SummaryView'


const mapStateToProps = (state, ownProps) => 
({
  isLoaded: state.isLoaded,
  runs: state.runs,
  router: ownProps.router
})

const mapDispatchToProps = dispatch => 
({
	onSelectRun(run) {
		dispatch(
			setSelectedRun(run)
		)
	}
})

const SummaryViewContainer =  connect(mapStateToProps, mapDispatchToProps)(SummaryView)
export default withRouter(SummaryViewContainer)