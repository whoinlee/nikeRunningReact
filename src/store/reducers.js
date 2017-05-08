import C from '../constants'
import { combineReducers } from 'redux'


export const fetching = (state=false, action) => {
  switch(action.type) {
    case C.FETCH_RUNS :
      return true

    case C.CANCEL_FETCHING :
      return false  

    default:
      return state
  }
}

export const runs = (state=[], action) => {
    switch(action.type) {
      case C.SET_RUNS:
        return action.payload

      default:
        return state
    }
}

export const selectedRun = (state={}, action) => {
    switch(action.type) {
      case C.SET_SELECTED_RUN :
        return action.payload

      case C.CLEAR_SELECTED_RUN :
        return {}

      default:
        return state
    }
}


export default combineReducers({
  fetching,
  runs,
  selectedRun
})