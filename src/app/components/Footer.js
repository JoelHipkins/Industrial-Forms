import React from 'react'
import BaseComponent from './BaseComponent'
import { NavLink } from 'react-router-dom'

export default class extends BaseComponent {

  render() {

  	let nav = this.props.data.nav.map((item, i) => {
      if (item.bypass) {
        return (
          <li key={ i }><a href={ item.route } className="nav-item" onClick={ this.hideNav } target="_blank">{ item.name }</a></li>
        )
      } else {
        return (
          <li key={ i }><NavLink to={ item.route } exact className="nav-item" activeClassName="active" onClick={ this.hideNav }>{ item.name }</NavLink></li>
        )
      }
    })

    let social = this.props.data.social.map((item, i) => {
        if (item.link) {
          return (
            <li key={ i }><a href={ item.link } target="_blank"><img src={ item.icon } alt={ item.name }/></a></li>
          )
        }
    })

    return (
      <footer className="footer">
	      <div className="container-big">
	      	<img className="logo-footer" src="/assets/img/logo-white.png" alt="Logo industrial forms footer"/>
	      	<ul className="social-links">
	      		{ social }
	      	</ul>
	      	<ul className="footer-nav">
	      		{ nav }
	      	</ul>
	      	<div className="footer-bottom">
		      	<p className="copyrights">© 2019 all rights reserved Industrial Forms</p>
		      	<p className="we-made-this">Projekt i wykonanie <a href="http://virtualpeople.pl" target="_blank" rel="noopener noreferrer">Virtual Group</a></p>
	      	</div>
	      </div>
      </footer>
    )
  }
}
