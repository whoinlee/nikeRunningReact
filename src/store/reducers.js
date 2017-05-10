import C from '../constants'
import { combineReducers } from 'redux'


export const isLoaded = (state=false, action) => {
  switch(action.type) {
    case C.FETCH_RUNS :
      return false

    case C.SET_RUNS:
      return true

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

export const run = (state=null, action) => {
    switch(action.type) {
      case C.SET_SELECTED_RUN :
        return action.payload

      case C.CLEAR_SELECTED_RUN :
        return null

      default:
        return state
    }
}

export default combineReducers({
  isLoaded,
  runs,
  run
})