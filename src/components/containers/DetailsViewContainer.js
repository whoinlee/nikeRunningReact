import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import DetailsView from '../views/DetailsView'
import { clearSelectedRun } from '../../actions'


const mapStateToProps = (state) => 
({
  	run: state.selectedRun
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
// const Container = connect(mapStateToProps, mapDispatchToProps)(DetailsView)	
// export default withRouter(Container)