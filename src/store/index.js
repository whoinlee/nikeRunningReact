import { createStore, applyMiddleware } from 'redux'
import appReducers from './reducers'
import logMiddleware from '../middleware/log'
import apiMiddleware from '../middleware/api'


export default createStore (
  appReducers,
  applyMiddleware(logMiddleware, apiMiddleware)
)