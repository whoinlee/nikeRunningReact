import C from '../constants'
import { setRuns } from '../actions'


const URL = './data/runs.json'
const apiMiddleware = ({ dispatch }) => next => action => {

  if (action.type === C.FETCH_RUNS) {
    fetch(URL)
    .then(response => response.json())
    .then(runs => {

        dispatch(setRuns(runs))

    })
    .catch(error => {

        console.log('Error fetching runs')

    })
  }
  next(action)

}

export default apiMiddleware