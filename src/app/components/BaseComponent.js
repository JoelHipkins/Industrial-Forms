/* Component for easier ES6 binding */

import { Component } from 'react';

export default class BaseComponent extends Component {

	// The rest parameter syntax allows to represent an indefinite number of arguments as an array.
	// https://developer.mozilla.org/pl/docs/Web/JavaScript/Reference/Functions/rest_parameters
	_bind(...methods) {
		methods.forEach( (method) => this[method] = this[method].bind(this) );
	}

	setContent(id) {
		this.setState({ index : id })
	}

	setWrapperHeight(h) {
		this.props.setHeight(h)
	}
}