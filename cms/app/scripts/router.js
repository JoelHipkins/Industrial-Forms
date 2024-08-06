'use strict'

import Backbone from 'backbone'
import Events from './events/events.js'

export default class Router extends Backbone.Router {

	get routes() {
		return {
			'': 'home',
			'home': 'home',
			'portfolio': 'portfolio',
			'products': 'products',
			'categories': 'categories',
			'login': 'login',
			'logout': 'logout',
			'settings': 'settings',
			'*notFound': 'error'
		}
	}

	constructor(options) {
		super(options)
		this.model = options.model
		this.dispatch = options.dispatch
		this.dispatch.on( Events.CHANGE_ROUTE, this.changeRoute, this )
	}

	initialize() {
		this.bind('route', this.change)
	}

	changeRoute(route) {
		Backbone.history.navigate(route, {trigger:true})
	}

	change(route) {
		this.model.set('route', route)
		this.model.dispatch.trigger( Events.MODEL_CHANGED )
		if( typeof ga != 'undefined' ) {
			ga('send', 'pageview', '/'+Backbone.history.getFragment())
		}
	}
}