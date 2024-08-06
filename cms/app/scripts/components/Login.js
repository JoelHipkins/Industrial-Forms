import React from 'react'
import BaseComponent from './BaseComponent'
import Parsley from 'parsleyjs'
import Events from '../events/events.js'
import $ from 'jquery'

export default class extends BaseComponent {

  constructor(props) {

    super(props)
    this._bind('login', 'checkForm')
    this.dispatch = this.props.dispatch
  }

  componentDidUpdate() {

  }

  checkForm(e) {
    e.preventDefault()
    if($('.login-form').parsley().validate()) {
      this.login();
    }
  }

  login() {
    let user = document.getElementById('user').value
    let password = document.getElementById('password').value
    this.dispatch.trigger( Events.LOGIN, { "user": user, "password": password } )
  }

  render() {

    return (
      <section className="login">
        <div className="login-panel">
          <div className="panel-title">CMS</div>
          <form className="login-form" data-parsley-validate>
            <input id="user" type="text" placeholder="User name" required data-parsley-error-message="User name"/>
            <input id="password" type="password" placeholder="Password" required data-parsley-error-message="Password"/>
            <button onClick={ this.checkForm }>Log in</button>
          </form>
          { this.props.error ? <div className="error">{ this.props.error }</div> : "" }
        </div>
      </section>
    )
  }
}
