import React from 'react'
import BaseComponent from './BaseComponent'
import Footer from './Footer'
import Helmet from 'react-helmet'
import _ from 'lodash'
import Modal from './Modal'
import ScrollReveal from 'scrollreveal'
import $ from 'jquery'

export default class extends BaseComponent {

  constructor(props) {
    super(props)
    this.state = { gallery: 0, popup: false, image: 0, single: false }
    this._bind('setGallery', 'showPopup', 'closePopup')
    this.product = _.filter(this.props.data.products, { slug: this.props.match.params.name })[0]
    this.sr = ScrollReveal({ reset: false, duration: 900 })
    $(window).scrollTop(0)
  }

  componentDidMount() {
    this.sr.reveal(".image", { delay: 400, origin: "left", distance: "60px" })
    this.sr.reveal(".text", { delay: 400, origin: "right", distance: "60px" })
    this.sr.reveal(".gallery", { delay: 400 })
  }

  showPopup (img) {
    this.setState({ popup: true, image: img })
  }

  closePopup () {
    this.setState({ popup: false })
  }

  setGallery(i) {
    if (i >= 0 && i < this.product.gallery.length) {
      this.setState({ gallery: i })
    }
  }

  render() {
    const Popup = (
      <div className="popup-inner gallery">
        <div className="close" onClick={ this.closePopup }><span>Close</span></div>
        { this.state.image > 0 ? <div className="prev" onClick={ this.showPopup.bind(null, this.state.image-1) }></div> : null }
        <img src={ this.product.gallery[this.state.image].path } alt=""/>
        { this.state.image < this.product.gallery.length-1 ? <div className="next" onClick={ this.showPopup.bind(null, this.state.image+1) }></div> : null }
      </div>
    )

    const PopupSingle = (
      <div className="popup-inner big">
        <div className="close" onClick={ this.closePopup }><span>Close</span></div>
        <img src={ this.product.image } alt=""/>
      </div>
    )

    let offset = 2
    if (this.props.screen.width > 1280) {
      offset = 3
    }

    return (
      <section className="product">
        <Helmet>
      		<title>Industrial Forms - { this.product.title }</title>
          <meta name="description" content={ this.product.subtitle } />
      	</Helmet>
      	<div className="container prod-top">
          <div className="text">
        		<h1>{ this.product.title }</h1>
            <h4 dangerouslySetInnerHTML={{ __html: this.product.subtitle }}></h4>
            <div className="content" dangerouslySetInnerHTML={{ __html: this.product.description }}></div>
          </div>
          <div className="image">
            <div className="border"></div>
            <img alt="" src={ this.product.image } onClick={ () => {
              this.setState({ single: true })
              this.showPopup(0)
            } }/>
          </div>
      	</div>
        <div className="gallery">
          { this.state.gallery > 0 ? <div className="prev" onClick={ this.setGallery.bind(null, this.state.gallery-1) }></div> : null }
          <div className="container">
            <ul className="gallery-inner">
              { this.product.gallery.map((item, i) => { return(<li key={ i } style={{ transform: "translateX(-" + this.state.gallery*100 + "%)" }} onClick={ () => { 
                this.setState({ single: false })
                this.showPopup(i) 
              } }><div className="img-holder"><img src={ item.path } alt=""/></div></li>) }) }
            </ul>
          </div>
          { this.state.gallery < this.product.gallery.length-offset ? <div className="next" onClick={ this.setGallery.bind(null, this.state.gallery+1) }></div> : null }
        </div>
        <div className="container">
          <div className="additional-content" dangerouslySetInnerHTML={{ __html: this.product.additional }}></div>
        </div>
        <Footer data={ this.props.data }/>
        <Modal open={ this.state.popup } hidePopup={ this.closePopup }>{ this.state.single ? PopupSingle : Popup }</Modal>
      </section>
    )
  }
}
