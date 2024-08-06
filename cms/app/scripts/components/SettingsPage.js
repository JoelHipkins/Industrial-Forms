import React from 'react'
import BaseComponent from './BaseComponent'
import Parsley from 'parsleyjs'
import Events from '../events/events.js'
import $ from 'jquery'

export default class extends BaseComponent {

  constructor(props) {

    super(props)
    this._bind('updateUserData', 'checkFormData', 'checkFormPassword', 'updateUserPassword', 'notification')
    this.state = { wrong: null }
    this.dispatch = this.props.dispatch
  }

  checkFormData(e) {
    e.preventDefault()
    if($('.update-form').parsley().validate()) {
      this.updateUserData();
    }
  }

  checkFormPassword(e) {
    e.preventDefault()
    if($('.password-form').parsley().validate()) {
      this.updateUserPassword();
    }
  }

  updateUserData() {
    let id = document.getElementById('id').value
    let user = document.getElementById('user').value
    let fullname = document.getElementById('fullname').value
    this.dispatch.trigger( Events.UPDATE_USER_DATA, { "user": user, "fullname": fullname, "id": id } )
  }

  updateUserPassword() {
    let id = document.getElementById('idp').value
    let oldPassword = document.getElementById('oldPassword').value
    let newPassword = document.getElementById('newPassword').value
    let newPassword2 = document.getElementById('newPassword2').value

    if (newPassword == newPassword2) {
      this.dispatch.trigger( Events.UPDATE_USER_PASSWORD, { "id": id, "oldPassword": oldPassword, "newPassword": newPassword } )
      this.setState({ wrong: null })
    } else {
      this.setState({ wrong: "Passwords cannot be different" })
    }
  }

  notification(){
    this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', 'bardzo długi tekst testowy sprawdzający breakline w notyfikacji' )
  }

  render() {

    return (
      <section className="settings">
        <h2 onClick={ this.notification }>Account settings for: { this.props.userData.fullname }</h2>

        <form className="update-form" data-parsley-validate>
          <label>User full name:</label>
          <input id="fullname" type="text" defaultValue={ this.props.userData.fullname } required data-parsley-minlength="3" data-parsley-error-message="Musisz podać pełną nazwę użytkownika (dłuższą niż 3 znaki)"/>
          <label>Login name:</label>
          <input id="user" type="text" defaultValue={ this.props.userData.user } required data-parsley-minlength="3" data-parsley-error-message="Musisz podać nazwę logowania (dłuższą niż 3 znaki)"/>
          <input id="id" type="hidden" defaultValue={ this.props.userData.id }/>
          <button onClick={ this.checkFormData }>Save</button>
        </form>
        <form className="password-form" data-parsley-validate>
          <label>Old password:</label>
          <input id="oldPassword" type="password" required data-parsley-minlength="6" data-parsley-error-message="Hasło musi być dłuższe niż 6 znaków"/>
          <label>New password:</label>
          <input id="newPassword" type="password" required data-parsley-minlength="6" data-parsley-error-message="Hasło musi być dłuższe niż 6 znaków"/>
          <label>Repeat new password:</label>
          <input id="newPassword2" type="password" required data-parsley-minlength="6" data-parsley-error-message="Hasło musi być dłuższe niż 6 znaków"/>
          { this.state.wrong }
          <input id="idp" type="hidden" defaultValue={ this.props.userData.id }/>
          <button onClick={ this.checkFormPassword }>Change password</button>
        </form>
      </section>
    )
  }
}
