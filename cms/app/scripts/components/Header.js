import React from 'react'
import ReactDOM from 'react-dom'
import BaseComponent from './BaseComponent'
import { Link } from 'react-router'
import Events from '../events/events.js'

export default class extends BaseComponent {

	constructor(props) {

		super(props)
		this.dispatch = this.props.dispatch
		this.state = { open: false }
		this._bind('options', 'hideOptions')
	}

	hideOptions() {
		this.setState({ open: false })
		this.dispatch.trigger( Events.HIDE_COVER )
	}

	options() {
		if (this.state.open) {
			this.setState({ open: false })
			this.dispatch.trigger( Events.HIDE_COVER )
		} else {
			this.setState({ open: true })
			this.dispatch.trigger( Events.SHOW_COVER )
		}
	}

	render() {

		return (
			<header>
				<div className="logo-container"><img className="logo" src={ this.props.logo }/></div>
				<div className="user" onClick={ this.options }><img src="images/icons/user.svg"/><span>{ this.props.userData.fullname }</span></div>
				<ul className={ this.state.open ? "options open" : "options" }>
					<li><a href="/settings" className="option" onClick={ this.hideOptions }><img src="images/icons/settings.svg"/><span>Settings</span></a></li>
					<li><a href="/logout" className="option" onClick={ this.hideOptions }><img src="images/icons/logout.svg"/><span>Log out</span></a></li>
				</ul>
			</header>
		)
	}
}
