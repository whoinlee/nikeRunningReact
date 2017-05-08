import store from './store/index'
import { fetchRuns } from './actions'



//-- test4
console.log("store:", store)


store.dispatch(fetchRuns())
window.store = store

console.log("store:", store)


//-- test3
// let state = {
// 	fetching: false,
// 	runs:[]
// }

// console.log(`

// 	Initial State
// 	=============
// 	fetching: ${state.fetching}
// 	runs: ${state.runs}
// `)

// const action = {
// 	type: C.FETCH_RUNS
// }

// let nextState = appReducers(state, action)

// console.log(`

// 	Next State
// 	=============
// 	fetching: ${nextState.fetching}
// 	runs: ${nextState.runs}
// `)


//-- test2
// const state = false
// const action = {
// 	type: C.FETCH_RUNS
// }

// const nextState = fetching(state, action)

// console.log(`

//     initial state: ${state}
//     action: ${JSON.stringify(action)}
//     new state: ${nextState}

// `)


//-- test1
// console.log(`

//    Sample Data
//    ===========
//    Initially there are '${runs.length}' runs in 'runs.json'



//    Constants (actions)
//    -------------------
//    ${Object.keys(C).join('\n   ')}

// `)