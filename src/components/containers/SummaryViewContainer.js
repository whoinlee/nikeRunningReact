import { connect } from 'react-redux'
import SummaryView from '../views/SummaryView'
import { setSelectedRun } from '../../actions'


const mapStateToProps = (state) => 
({
  runs: state.runs
})

const mapDispatchToProps = dispatch => 
({
	onSelectRun(run) {
		dispatch(
			setSelectedRun(run)
		)
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(SummaryView)