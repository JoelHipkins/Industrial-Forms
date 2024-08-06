import React from 'react'
import ReactDOM from 'react-dom'
import BaseComponent from './BaseComponent'
import Events from '../events/events.js'

export default class extends BaseComponent {

	constructor(props) {

		super(props)
		this.dispatch = this.props.dispatch
		this._bind('hideNav', 'toggleMenu', 'publish')
		this.state = {nav: 0}
	}

	hideNav() {

		this.setState({nav: 0})
		this.dispatch.trigger( Events.HIDE_COVER )
	}

	toggleMenu() {

		if (this.state.nav == 0) {

			this.setState({nav: 1})
			this.dispatch.trigger( Events.SHOW_COVER )
		} else {

			this.setState({nav: 0})
			this.dispatch.trigger( Events.HIDE_COVER )
		}
	}

	publish() {
		this.dispatch.trigger( Events.PUBLISH )
	}

	render() {

		let navItems = (
			this.props.nav.map((item, i) => {
				const key = item.name+'-nav'
				let className = ''
				'/'+this.props.route === item.url ? className = 'nav-item active' : className = 'nav-item'
				return (
					<li key={ item.url }><a href={ item.url } className={ className } onClick={ this.hideNav }><img src={ item.icon }/><span>{ item.name }</span></a></li>
				)
			})
		)

		var cl = ""

		this.state.nav == 0 ? cl = "" : cl = "open"

		return (
			<aside className={ cl }>
				<div id="burger" className={ cl } onClick={ this.toggleMenu }><div className="in"></div></div>
				<nav>
					<button className="publish" onClick={ this.publish }>Publish changes</button>
					<ul>
						{ navItems }
					</ul>
				</nav>
				<div className="copyrights">© 2018 <a href="http://virtualpeople.pl/" target="_blank" data-bypass><b>virtual people</b></a></div>
			</aside>
		)
	}
}
