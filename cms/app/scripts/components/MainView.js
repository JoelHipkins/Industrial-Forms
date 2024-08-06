import React from 'react'
import ReactDOM from 'react-dom'
import TransitionGroup from 'react-addons-css-transition-group'
import $ from 'jquery'
import BaseComponent from './BaseComponent'
import Header from './Header'
import Navigation from './Navigation'
import Footer from './Footer'
import Login from './Login'
import HomePage from './HomePage'
import GalleryPage from './GalleryPage'
import ProductsPage from './ProductsPage'
import CategoriesPage from './CategoriesPage'
import SettingsPage from './SettingsPage'
import ErrorPage from './ErrorPage'
import Events from '../events/events.js'

export default class extends BaseComponent {

  constructor(props) {

    super(props)
    this.dispatch = this.props.dispatch
    this.state = { screen : { width: window.innerWidth, height: window.innerHeight }, cover: false, notification: null}
    this._bind('handleResize', 'showCover', 'hideCover', 'showNotification', 'hideNotification')
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.dispatch.on( Events.SHOW_COVER, this.showCover, this )
    this.dispatch.on( Events.HIDE_COVER, this.hideCover, this )
    this.dispatch.on( Events.SHOW_NOTIFICATION, this.showNotification, this )
  }

  componentDidUpdate() {
    if (this.props.userLogged === false) {
      this.dispatch.trigger( Events.CHANGE_ROUTE, 'login' )
    } else if (this.props.route == 'login' && this.props.userLogged === true) {
      this.dispatch.trigger( Events.CHANGE_ROUTE, 'home' )
    }
  }

  handleResize(e) {
    this.setState({ screen : { width: window.innerWidth, height: window.innerHeight }})
  }

  showCover() {
    this.setState({ cover: true })
  }

  hideCover() {
    this.setState({ cover: false })
  }

  showNotification(type, message) {
    let notification = (
      <div className={ "notification " + type } onClick={ this.hideNotification }>
        <div className="close">Click to close</div>
        <div>{ message }</div>
      </div>
    )
    this.setState({ notification: notification })
  }

  hideNotification() {
    this.setState({ notification: null })
  }

  render() {
    let page = ""

    switch(this.props.route) {
      case 'login':
        page = <Login dispatch={ this.dispatch } userLogged={ this.props.userLogged } error={ this.props.error }/>
      break
      case 'home':
        page = <HomePage dispatch={ this.dispatch } userData={ this.props.userData } todos={ this.props.todos }/>
      break
      case 'products':
        page = <ProductsPage dispatch={ this.dispatch } products={ this.props.products } images={ this.props.images }/>
      break
      case 'categories':
        page = <CategoriesPage dispatch={ this.dispatch } categories={ this.props.categories } images={ this.props.images }/>
      break
      case 'portfolio':
        page = <GalleryPage dispatch={ this.dispatch } gallery={ this.props.gallery } categories={ this.props.categories } images={ this.props.images }/>
      break
      case 'settings':
        page = <SettingsPage dispatch={ this.dispatch } userData={ this.props.userData } userLogged={ this.props.userLogged }/>
      break
      case 'logout':
        this.dispatch.trigger( Events.LOGOUT )
      break
    }
    return (
      <div className="app-inner">
        { this.props.userLogged ? <Header userData={ this.props.userData } dispatch={ this.dispatch } logo={ this.props.data.config.logo }/> : '' }
        { this.state.notification }
        { this.props.userLogged ? <Navigation nav={ this.props.data.nav } route={ this.props.route } screen={ this.state.screen } dispatch={ this.dispatch }/> : '' }
        <div className="page-holder">
          { this.state.cover ? <div className="cover"></div> : "" }
          { page }
          {/*<Footer sticky={ this.props.userLogged ? "" : "sticky" }/>*/}
        </div>
      </div>
    )
  }
}
