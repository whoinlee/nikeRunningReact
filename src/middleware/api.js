import C from '../constants'
import { setRuns } from '../actions'
import fetch from 'isomorphic-fetch'  //???? no need ????


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

// const dataPath = './data/'

// export const fetchtRuns = value => dispatch => {
//     console.log("ever? fetchtRuns")

//     dispatch({
//         type: C.FETCH_RUNS
//     })

//     fetch(dataPath + value)
//         .then( response => response.json() )
//         .then( runs => {
//             console.log("ever? runs available at " + dataPath + value)
//             dispatch(
//                 setRuns(runs)
//             ) 
//         })
//         .catch(error => {
//             console.log("ever? error")
//             // dispatch(
//             //     addError(error.message)
//             // )

//             dispatch({
//                 type: C.CANCEL_FETCHING
//             })
//         })
// }