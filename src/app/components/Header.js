import React from 'react'
import BaseComponent from './BaseComponent'
import { NavLink } from 'react-router-dom'

export default class extends BaseComponent {

  constructor(props) {
    super(props)
    this._bind('hideNav', 'toggleMenu')
    this.state = {nav: 0, sticky: false}
  }

  componentDidMount() {
    document.addEventListener('scroll', (e) => {
      if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
            this.setState({ sticky: true })
        } else {
            this.setState({ sticky: false })
        }
      })
  }

  hideNav() {
    this.setState({nav: 0})
  }

  toggleMenu() {
    if (this.state.nav === 0) {
      this.setState({nav: 1})
    } else {
      this.setState({nav: 0})
    }
  }

  render() {

    let nav = this.props.data.nav.map((item, i) => {
      if (item.bypass) {
        return (
          <li key={ i }><a href={ item.route } className="nav-item" onClick={ this.hideNav } target="_blank">{ item.name }</a></li>
        )
      } else {
        return (
          <li key={ i }><NavLink to={ item.route } className="nav-item" activeClassName="active" onClick={ this.hideNav }>{ item.name }</NavLink></li>
        )
      }
    })

    return (
      <header className={ this.state.sticky ? "sticky" : "" }>
        <div className="container-big">
          <NavLink to="/"><img className="logo" src="/assets/img/logo.png" alt="Logo"/></NavLink>
          <div className={ this.state.nav === 0 ? "burger" : "burger open" } onClick={ this.toggleMenu }><div className="line"></div></div>
          <nav className={ this.state.nav === 0 ? "" : "open" }>
            <ul>
              { nav }
              <li><NavLink className="InstantQuote-btn" to="/get-instant-quote">Get instant quote</NavLink></li>
            </ul>
          </nav>
        </div>
      </header>
    )
  }
}
