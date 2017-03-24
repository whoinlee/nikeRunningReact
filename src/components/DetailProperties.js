import React, { Component } from 'react'
import _ from 'lodash'
import '../stylesheets/detailProperties.scss'


class DetailProperties extends Component {

	constructor(props) {
	    super(props)
	    this.state = {
	    	keyValueProps: []
	    }
	    this.objToProps = this.objToProps.bind(this)
	}

	componentDidMount() {
	    this.objToProps(this.props.model)
	}

	objToProps(obj) {
		// console.log("INFO DetailProperties :: objToProps, obj is " + obj)
		// console.log("INFO DetailProperties :: objToProps, test, _.titleize('my name is epeli')" + _.chain('my name is epeli').titleize())
		// let arr = _.map(obj, (key, value){
		// 	return {key:value};
		// })
		let arr = _.map(obj, (key, value) => {
			let thisKey = key
			let thisValue = value

			if (thisKey === "tags") {
                thisValue = "skip"
            }

            if (_(thisValue).isArray()) {
                thisValue = '[' + thisValue.length + ' items]';
            }
            if (_(thisValue).isObject()) {
                    thisValue = "skip"
                } else {
                    thisValue = thisValue.replace(/ipod/gi,'iPod');
                    thisValue = thisValue.replace(/iphone/gi, 'iPhone');
                    thisValue = thisValue.replace(/gps/gi, 'GPS');
                    thisValue = thisValue.replace(/gmt/gi, 'GMT');
                }

			return [thisKey, thisValue]
		})
		console.log("arr.length is " + arr.length)
		// console.log("arr[0] is " + arr[0])
		// console.log("arr is " + arr)
		this.setState({keyValueProps:arr})

		/*
		_(obj).reduce(function(html, value, key) {
                if (key === 'tags') {
                    return html + _(value).reduce(function(html, tag) {
                        if (tag.tagValue) {
                            var obj = {};
                            obj[tag.tagType] = _.chain(tag.tagValue).humanize().titleize().value();
                            html += this.obj2Html(obj);
                        }
                        return html;
                    }, '', this);
                }
                key = _.chain(key).humanize().titleize().value();
                if (_(value).isArray()) {
                    value = '[' + value.length + ' items]';
                }
                if (_(value).isObject()) {
                    html += this.obj2Html(value);
                } else {
                    value = _(value.toString().toLowerCase()).titleize();
                    value = value.replace(/ipod/gi,'iPod');
                    value = value.replace(/iphone/gi, 'iPhone');
                    value = value.replace(/gps/gi, 'GPS');
                    value = value.replace(/gmt/gi, 'GMT');
                    html += this.template({ key: key, value: value });
                }
                return html;
            }, '', this)
         */
	}

	render() {
		const { keyValueProps } = this.state
		return (
			<div>
				<h1>This is a sample Properties page</h1>
				<dl>
					{keyValueProps.map((prop, i) => {
						return [
							<dt>{prop[0]}</dt>,
							<dd>{prop[1]}</dd>
						]
					})}
				</dl>
			</div>
		)
	}
}

DetailProperties.propTypes = {
	model: React.PropTypes.object.isRequired
}

export default DetailProperties