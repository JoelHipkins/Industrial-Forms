import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class extends Component {

  render () {

    return (
      <section className="error">
        <div className="container">
    			<h1>{ this.props.data.error.fourofour }</h1>
  				<h3 className="error">{ this.props.data.error.notFound }</h3>
  				<NavLink to="/">&lt;&nbsp;&nbsp;{ this.props.data.error.backToHome }</NavLink>
	  	  </div>
      </section>
    )
  }
}
