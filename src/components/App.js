import React, { Component } from 'react'
// import { browserHistory } from 'react-router'
import { hashHistory } from 'react-router'
import fetch from 'isomorphic-fetch'
import _ from 'underscore'

import SummaryView from './SummaryView'
import DetailsView from './DetailsView'
import Whoops404 from './Whoops404'
import '../stylesheets/App.scss'


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      runs:[],
      loading:false,
      showDetail:false,
      selectedID: null,
      selectedObj: null,
      showError:false
    }
    this.showDetailView = this.showDetailView.bind(this)
    this.showSummaryView = this.showSummaryView.bind(this)
    this.getSelectedObj = this.getSelectedObj.bind(this)
  }

  componentDidMount() {
    this.setState({loading:true})

    fetch('./data/runs.json')
    .then(response => response.json())
    .then(runs => {
      console.log("INFO App :: componentDidMount, data loaded")
      console.log("INFO App :: componentDidMount, this.props.location.pathname is " + this.props.location.pathname)
      this.setState({runs: runs, loading:false})
      if ((this.props.location.pathname).startsWith('/runs/')) {
        let id = (this.props.location.pathname).substring(6)
        let run = this.getSelectedObj(id)
        if (run === undefined) {
          //-- Whoops404.js
          this.setState({showError:true})
        } else {
          this.showDetailView(id)
        }
      } else if (this.props.location.pathname !== '/') {
        this.setState({showError:true})
      }
    })
  }

  getSelectedObj(id) {
    return _.findWhere(this.state.runs, {"activityId": id})
  }

  showDetailView(id) {
    //TODO change address
    console.log("INFO App :: showDetailView, id is " + id)
    console.log("INFO App :: showDetailView, 1 this.props.location.pathname is " + this.props.location.pathname)
    let run = this.getSelectedObj(id)
    if (run === undefined) {
      this.setState({showError:true})
    } else {
      hashHistory.push('/runs/' + id)
      this.setState({showDetail:true, selectedID:id, selectedObj:run})
    }
    // console.log("INFO App :: showDetailView, 2 this.props.location.pathname is " + this.props.location.pathname)
  }

  showSummaryView() {
    // console.log("INFO App :: showSummaryView")
    console.log("INFO App :: showSummaryView, 1 this.props.location.pathname is " + this.props.location.pathname)
    hashHistory.push('/')
    this.setState({showDetail:false})
    // console.log("INFO App :: showSummaryView, 2 this.props.location.pathname is " + this.props.location.pathname)
  }

  render() {
      const { runs, loading, showDetail, selectedID, selectedObj, showError } = this.state

      return (
        <div className="App">
          <div className="App-header">
            <h2>A Sample Data Visualization w. Nike+ API data, built with React</h2>
          </div>
          { (showError)?
            <Whoops404 /> :
            (!loading && (runs.length > 0) && !showDetail) ?
              <SummaryView runs={runs} callBack={this.showDetailView} /> : 
              (showDetail) ?
                <DetailsView run={selectedObj} id={selectedID} callBack={this.showSummaryView} /> :
                <span>...loading</span>}
        </div>
      )
  }
}

export default App