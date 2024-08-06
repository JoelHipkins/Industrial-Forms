import React from 'react'
import BaseComponent from './BaseComponent'
import Footer from './Footer'
import Helmet from 'react-helmet'
import { NavLink } from 'react-router-dom'
import Modal from './Modal'
import ScrollReveal from 'scrollreveal'
import $ from 'jquery'

export default class extends BaseComponent {

  constructor(props) {
    super(props)
    this.state = { popup: false }
    this._bind('showPopup', 'closePopup')
    this.sr = ScrollReveal({ reset: false, duration: 900 })
    $(window).scrollTop(0)
  }

  componentDidMount() {
    this.sr.reveal(".items li", { delay: 400, origin: "right", distance: "60px", interval: 100 })
    this.sr.reveal("h1, p, .btn", { delay: 400, origin: "left", distance: "60px" })
  }

  showPopup () {
    this.setState({ popup: true })
  }

  closePopup () {
    this.setState({ popup: false })
  }

  render() {
  	const data = this.props.data.development

    const Popup = (
      <div className="popup-inner">
        <div className="close" onClick={ this.closePopup }><span>{ data.close }</span></div>
        <h4>{ data.popupTitle }</h4>
        <p>{ data.popupDesc }</p>
        <ul className="list">
          { data.popupList.map((item, i) => { return ( <li key={ i }>{ item }</li> ) }) }
        </ul>
      </div>
    )

    return (
      <section className="development">
        <Helmet>
      		<title>Industrial Forms - { data.metaTitle }</title>
            <meta name="description" content={ data.metaDesc } />
      	</Helmet>
      	<div className="container">
      		<h1>{ data.title }</h1>
          <p>{ data.desc }</p>
          <button className="btn" onClick={ this.showPopup }>{ data.btnText }</button>
          <div className="items-container">
            <img className="bg-img" src="/assets/img/dev-bg-img.png" alt=""/>
            <ul className="items">
              <li>
                <div className="img">
                  <img src="/assets/img/dev-icon-1.png" alt=""/>
                </div>
                <h2 dangerouslySetInnerHTML={{ __html: data.cad }}></h2>
                <NavLink to="/development/cad-design" className="btn">{ data.btnText }</NavLink>
              </li>
              <li>
                <div className="bg"></div>
                <div className="img">
                  <img src="/assets/img/dev-icon-2.png" alt=""/>
                </div>
                <h2 dangerouslySetInnerHTML={{ __html: data.design }}></h2>
                <NavLink to="/development/design-optimization" className="btn">{ data.btnText }</NavLink>
              </li>
              <li>
                <div className="img">
                  <img src="/assets/img/dev-icon-3.png" alt=""/>
                </div>
                <h2 dangerouslySetInnerHTML={{ __html: data.production }}></h2>
                <NavLink to="/development/additive-production" className="btn">{ data.btnText }</NavLink>
              </li>
            </ul>
          </div>
      	</div>
        <Footer data={ this.props.data }/>
        <Modal open={ this.state.popup } hidePopup={ this.closePopup }>{ Popup }</Modal>
      </section>
    )
  }
}
