import React, { Component } from 'react'
import fetch from 'isomorphic-fetch'
import _ from 'underscore'

import SummaryView from './SummaryView'
import DetailsView from './DetailsView'
import '../stylesheets/App.scss'


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      runs:[],
      loading:false,
      showDetail:false,
      selectedID: null,
      selectedObj: null
    }
    this.showDetailView = this.showDetailView.bind(this)
    this.showSummaryView = this.showSummaryView.bind(this)
    this.getSelectedObj = this.getSelectedObj.bind(this)
  }

  componentDidMount() {
    this.setState({loading:true})

    fetch('./data/runs.json')
    .then(response => response.json())
    .then(runs => this.setState({runs, loading:false}))
  }

  getSelectedObj(id) {
    return _.findWhere(this.state.runs, {"activityId": id})
  }

  showDetailView(id) {
    console.log("INFO App :: showDetailView, id is " + id)
    //-- CHECK!!! this.props.location.pathname = "/runs/" + id ----> routing, how?
    let run = this.getSelectedObj(id)
    // console.log("INFO App :: showDetailView, run.activityId is " + run.activityId)
    this.setState({showDetail:true, selectedID:id, selectedObj:run})
  }

  showSummaryView() {
    console.log("INFO App :: showSummaryView")
    //-- CHECK: destroy detail view (done?)
    this.setState({showDetail:false})
  }

  render() {
      const { runs, loading, showDetail, selectedID, selectedObj } = this.state

      return (
        <div className="App">
          <div className="App-header">
            <h2>A Sample Data Visualization w. Nike+ API data built in React</h2>
          </div>
          {(!loading && (runs.length > 0) && !showDetail) ?
            <SummaryView runs={runs} callBack={this.showDetailView}/> : 
            (showDetail) ?
              <DetailsView run={selectedObj} id={selectedID} callBack={this.showSummaryView}/> :
              <span>...loading</span>
          }
        </div>
      )
  }
}

export default App