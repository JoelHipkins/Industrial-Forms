import React from 'react'
import BaseComponent from './BaseComponent'
import Footer from './Footer'
import Helmet from 'react-helmet'
import $ from 'jquery'
import 'parsleyjs'
import Modal from './Modal'
import Map from './Map'
import ScrollReveal from 'scrollreveal'

export default class extends BaseComponent {

  constructor(props) {
  	super(props)
  	this.state = { error: false, popup: false, name: "", email: "", message: "" }
  	this._bind('showPopup', 'closePopup', 'closeError', 'sendForm', 'submitForm', 'handleInputChange')
    this.sr = ScrollReveal({ reset: false, duration: 900 })
    $(window).scrollTop(0)
  }

  componentDidMount() {
    this.sr.reveal(".data-form", { delay: 400, origin: "left", distance: "60px" })
  }

  showPopup () {
    this.setState({ popup: true })
  }

  showError () {
    this.setState({ error: true })
  }

  handleInputChange(event) {
    const target = event.target
    let value = target.type === 'checkbox' ? target.checked : target.value
    let name = target.name

    this.setState({
      [name]: value
    })
  }

  closePopup () {
    this.setState({ popup: false })
    this.setState({ name: "", email: "", message: "" })
  }

  closeError () {
    this.setState({ error: false })
    this.setState({ name: "", email: "", message: "" })
  }

  sendForm(e) {
    e.preventDefault()

    if($('.form').parsley().validate()) {
      this.submitForm()
    }
  }

  submitForm() {
    const data = {
      name: this.state.name,
      email: this.state.email,
      message: this.state.message,
      type: "contact"
    }

    fetch('/mailer/index.php', {
        method: "POST", 
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(data),
    })
    .then((response, status) => {
      return response.json()
    })
    .then((result) => {
      if (result.result === 0) {
        this.showError()
      } else {
        this.showPopup()
      }
    },(error) => {
      this.showError()
      console.log(error)
    })
  }

  render() {
  	let data = this.props.data.contact

  	const Popup = (
      <div className="popup-inner">
        <div className="close" onClick={ this.closePopup }></div>
        <h1>{ data.thankYou }</h1>
        <p>{ data.messageSend }</p>
      </div>
    )

    const ErrorPopup = (
      <div className="popup-inner">
        <div className="close" onClick={ this.closeError }></div>
        <h1>{ data.error }</h1>
        <p>{ data.sendError }</p>
      </div>
    )

    return (
      <section className="contact">
      	<Helmet>
      		<title>Industrial Forms - { data.title }</title>
            <meta name="description" content={ data.metaDesc } />
      	</Helmet>
      	<div className="contact-inner">
	        <div className="data-form container">
	        	<h1>{ data.title }</h1>
	        	<p>{ data.desc }</p>
	        	<div className="data-inner">
	        		<div>
	        			<h3>{ data.location }</h3>
	        			<p dangerouslySetInnerHTML={{ __html: data.contactData }}></p>
	        		</div>
	        		<div>
	        			<h3><span>{ data.phone }</span></h3>
                <a href={ "tel:" + data.phoneNo }>{ data.phoneNo }</a>
                <h3><span>{ data.email }</span></h3>
                <a href={ "mailto:" + data.emailAddress }>{ data.emailAddress }</a>
	        		</div>
	        	</div>
	        	<form className="form" data-parsley-validate>
		        	<div className="inputs">
		        		<input type="text" name="name" value={ this.state.name } placeholder={ data.name } onChange={ this.handleInputChange } required/>
		        		<input type="email" name="email" value={ this.state.email } placeholder={ data.email } onChange={ this.handleInputChange } required/>
	        		</div>
	        		<textarea placeholder={ data.inquiry } name="message" value={ this.state.message } onChange={ this.handleInputChange } required></textarea>
	        		<button className="btn" onClick={ this.sendForm }>{ data.send }</button>
	        	</form>
	        </div>
	        <div className="map">
	        	<Map/>
	        </div>
        </div>
        <Footer data={ this.props.data }/>
        <Modal open={ this.state.popup }>{ Popup }</Modal>
        <Modal open={ this.state.error }>{ ErrorPopup }</Modal>
      </section>
    )
  }
}
