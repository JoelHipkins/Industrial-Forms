import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'underscore'
import Backbone from 'backbone'
import Router from './Router'
import Events from './events/events.js'
import MainView from './components/MainView'
import Model from './model'
import $ from 'jquery'

export default class Main {

	constructor() {
		this.dispatch = _.extend({}, Backbone.Events )
		this.model = new Model({ dispatch : this.dispatch })
		this.router = new Router({ model : this.model, dispatch : this.dispatch })
		this.init()
	}

	init() {
		this.model.preloadJSON('data/data.json')
		this.dispatch.on( Events.JSON_LOADED, this.ready, this )
		this.dispatch.trigger( Events.GET_USER_DATA )
		Backbone.history.start({pushState: false})
	}

	ready() {
		this.dispatch.on( Events.MODEL_CHANGED, this.render, this )
		this.render()
	}

	render() {
		const mainContainer = document.getElementById('app')

		ReactDOM.render(
			<MainView 
				data={ this.model.get('data') } 
				userLogged={ this.model.get('userLogged') } 
				userData={ this.model.get('userData') } 
				products={ this.model.get('products') } 
				categories={ this.model.get('categories') } 
				gallery={ this.model.get('gallery') } 
				images={ this.model.get('images') } 
				todos={ this.model.get('todos') } 
				error={ this.model.get('error') } 
				route={ this.model.get('route') } 
				dispatch={ this.dispatch }/>
		, mainContainer)
	}
}

const app = new Main()

$(document).on("click", "a[href]:not([data-bypass])", function(e) {
	let href = $(this).attr("href")
	e.preventDefault()
	Backbone.history.navigate(href, true)
})