import React, { Component } from 'react'
import _ from 'underscore'
import S from 'string'
import '../stylesheets/detailProperties.scss'


const capitalize = (str) => {
  	let word = str;
  	if (word[0] && word.toUpperCase)
    	return word[0].toUpperCase() + word.slice(1);
}
const is_article = (word) => ((word == "a" || word == "an") ? true : false)
const titleize = (str) => {
	let words = str.split(" ")
	let word_count = words.length
	for (var i = 0; i < word_count; i++)
	    if (i == 0 || !is_article(words[i]))
	      words[i] = capitalize(words[i])
	return words.join(" ");
}

class DetailProperties extends Component {

	constructor(props) {
	    super(props)
	    this.state = {
	    	propsArr: []
	    }
	    this.objToProps = this.objToProps.bind(this)
	}

	componentWillUnmount() {
		console.log('INFO DetailProperties :: componentWillUnmount')
	}

	componentDidMount() {
	    let propsArr = this.objToProps(this.props.model, [])
	    this.setState({propsArr:propsArr})
	}

	objToProps(obj, propsArr=[]) {
		let resultPropsArr = propsArr
		let that = this
		_.each(obj, (value, key) => {
			let thisKey = titleize(S(key).humanize())
			let thisValue, thispropsArr

			if (key === "tags") {
				//-- value is an array of objects
				value.forEach((tagObj) => {
					if (tagObj.tagValue) {
						let newKey = titleize(S(tagObj["tagType"]).humanize())
						let newValue = titleize(S(tagObj["tagValue"]).humanize())
						resultPropsArr.push([newKey, newValue])
					}
				})
            } else if (_(value).isArray()) {
	            thisValue = '[' + value.length + ' Items]'
	            thispropsArr = [thisKey,thisValue]
	            resultPropsArr.push(thispropsArr)
            } else if (_(value).isObject()) {
            	//-- array is also an object. therefore, isObject() should be checked after isArray()
				thispropsArr = that.objToProps(value, [])
				resultPropsArr = resultPropsArr.concat(thispropsArr)
			} else {
            	thisValue = titleize(S(value.toString()).humanize())
                thisValue = thisValue.replace(/ipod/gi,'iPod')
                thisValue = thisValue.replace(/iphone/gi, 'iPhone')
                thisValue = thisValue.replace(/gps/gi, 'GPS')
                thisValue = thisValue.replace(/gmt/gi, 'GMT')
                thispropsArr = [thisKey,thisValue]
                resultPropsArr.push(thispropsArr)
            }
		})
		return resultPropsArr;
	}

	render() {
		const { propsArr } = this.state
		return (
			<div id="properties">
				<table>
					<thead>
			          <tr>
			            <th>Property</th>
			            <th>Value</th>
			          </tr>
			        </thead>
			        <tbody>
			        	{propsArr.map((prop, index) => {
							return (
								<tr key={"id" + index}>
									<td>{prop[0]}</td>
									<td>{prop[1]}</td>
								</tr>
							)
						})}
			        </tbody>
				</table>
			</div>
		)
	}
}


DetailProperties.propTypes = {
	model: React.PropTypes.object.isRequired
}

export default DetailProperties