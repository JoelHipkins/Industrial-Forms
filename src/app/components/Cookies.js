import React from 'react'
import BaseComponent from './BaseComponent'

export default class extends BaseComponent {

  constructor(props) {

    super(props)
    this.state = { cookie: this.readCookie('cookie-info') }
    this._bind('createCookie', 'readCookie', 'acceptCookies')
  }

  createCookie(name,value,days) {
    let expires
      if (days) {
          let date = new Date()
          date.setTime(date.getTime()+(days*24*60*60*1000))
          expires = "; expires="+date.toGMTString()
      }
      else expires = ""
      document.cookie = name+"="+value+expires+"; path=/"
  }

  readCookie(name) {
      let nameEQ = name + "="
      let ca = document.cookie.split(';')
      for(let i=0;i < ca.length;i++) {
          let c = ca[i]
          while (c.charAt(0)===' ') c = c.substring(1,c.length)
          if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length)
      }
      return null
  }

  acceptCookies() {
    this.setState({ cookie: true })
    this.createCookie('cookie-info', true, 30)
  }

  render() {

    return (
      <div className={ !this.state.cookie ? "cookies show" : "cookies" }><div className="close" onClick={ this.acceptCookies }></div><div dangerouslySetInnerHTML={{ __html: this.props.data.cookies }}></div></div>
    )
  }
}
