import C from '../constants'
import { setRuns } from '../actions'
import fetch from 'isomorphic-fetch' 


const URL = './data/runs.json'

function fetchData(url, callback) {

  fetch(url)
    .then((response) => {
      if (response.status !== 200) {
        console.log(`Error fetching runs: ${ response.status }`);
      } else {
        // console.log("callback:", callback)
        response.json().then(callback)
      }
    })
    .catch((err) => {
      console.log(`Error fetching runs: ${ err }`)
    })
    
}

const apiMiddleware = ({ dispatch }) => next => action => {

  if (action.type === C.FETCH_RUNS) {
    fetchData(URL, data => dispatch( setRuns(data) ))
  }
  next(action)

}

export default apiMiddleware