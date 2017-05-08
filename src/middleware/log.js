const logMiddleware = ({ getState, dispatch }) => next => action => {

  	console.log(`Action: ${ action.type }`)
  	// if (action.payload)
  	// 	console.log(`action.payload: ${ action.payload }`)
  	
  	next(action)

}

export default logMiddleware;