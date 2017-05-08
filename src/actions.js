import C from './constants'


export const fetchRuns = () => 
({
    type: C.FETCH_RUNS
})

export const setRuns = (runs) => 
({
    type: C.SET_RUNS,
    payload: runs
})

export const setSelectedRun = (run) => 
({
    type: C.SET_SELECTED_RUN,
    payload: run
})

export const clearSelectedRun = () => 
({
    type: C.CLEAR_SELECTED_RUN
})

export const cancelFetching = () => 
({
    type: C.CANCEL_FETCHING
})