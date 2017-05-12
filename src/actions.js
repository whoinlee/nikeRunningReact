import C from './constants'


// const URL = './data/runs.json'
// export const fetchRuns = () => dispatch =>
// {
// 	dispatch ({ type: C.FETCH_RUNS })

//     fetch(URL)
//     .then(response => response.json())
//     .then(runs => {

//         dispatch({ type: C.SET_RUNS, payload: runs })

//     })
//     .catch(error => {

//         console.log('Error fetching runs')

//     })
// }

export const fetchRuns = () => ({ type: C.FETCH_RUNS })

export const setRuns = (runs) => ({ type: C.SET_RUNS, payload: runs })

export const setSelectedRun = (run) => ({ type: C.SET_SELECTED_RUN, payload: run })

export const clearSelectedRun = () => ({ type: C.CLEAR_SELECTED_RUN })
