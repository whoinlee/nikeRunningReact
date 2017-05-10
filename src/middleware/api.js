import C from '../constants'
import { setRuns, cancelFetching } from '../actions'
import fetch from 'isomorphic-fetch' 


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