import React from 'react'
import BaseComponent from './BaseComponent'
import Footer from './Footer'
import Helmet from 'react-helmet'
import _ from 'lodash'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { NavLink } from 'react-router-dom'
import Modal from './Modal'
import $ from 'jquery'

export default class extends BaseComponent {

  constructor(props) {
    super(props)
    this.state = { image: 0, popup: false, gallery: 0 }
    this._bind('setImage', 'showPopup', 'closePopup', 'setGallery')
    this.selectedImages = null
    $(window).scrollTop(0)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.setState({ image: 0 })
    }
  }

  setImage(i) {
    this.setState({ image: i })
  }

  showPopup (img) {
    this.setState({ popup: true, image: img })
  }

  closePopup () {
    this.setState({ popup: false })
  }

  setGallery(i) {
    if (i >= 0 && i < this.selectedImages.length) {
      this.setState({ gallery: i })
    }
  }

  render() {
  	const data = this.props.data.portfolioPage

    let selectedCat = this.props.match.params.category ? this.props.match.params.category : "automotive"

    let selectedSingleCat = _.filter(this.props.data.categories, { slug: selectedCat })[0]

    let selectedCatId = selectedSingleCat.id

    let view = this.props.match.params.album ? "detailed" : "full"

    let selectedGalleryId = null, selectedSingleGallery = null

    if (this.props.match.params.album) {
      selectedSingleGallery = _.filter(this.props.data.portfolio, { slug: this.props.match.params.album })[0] || null
      selectedGalleryId = selectedSingleGallery.id
    }

    let categories = this.props.data.categories.map((item, i) => {
      return (
        <li key={ i }><NavLink to={ "/portfolio/" + item.slug } className={ selectedCat === item.slug ? "active" : "" }>{ item.title }</NavLink></li>
      )
    })

    let selectedGallery = _.filter(this.props.data.portfolio, { parent: selectedCatId }) || null

    let gallery = selectedGallery.map((item, i) => {
      return (
        <li className="album" key={ i }><NavLink to={ "/portfolio/" + selectedCat + "/" + item.slug } className="album-inner" style={{ backgroundImage: "url(" + item.image + ")" }}><span>{ item.title }</span></NavLink></li>
      )
    })

    if (selectedGalleryId !== null && selectedSingleGallery.gallery.length > 0) {
      this.selectedImages = selectedSingleGallery.gallery
    } else {
      this.selectedImages = [{}]
    }

    const Popup = (
      <div className="popup-inner gallery">
        <div className="close" onClick={ this.closePopup }><span>Close</span></div>
        { this.state.image > 0 ? <div className="prev" onClick={ this.showPopup.bind(null, this.state.image-1) }></div> : null }
        <img src={ this.selectedImages[this.state.image].path } alt=""/>
        { this.state.image < this.selectedImages.length-1 ? <div className="next" onClick={ this.showPopup.bind(null, this.state.image+1) }></div> : null }
      </div>
    )

    let offset = 2
    if (this.props.screen.width > 1280) {
      offset = 3
    }

    return (
      <section className="portfolio">
        <Helmet>
      		<title>Industrial Forms - { data.metaTitle }</title>
          <meta name="description" content={ data.metaDesc } />
      	</Helmet>
      	<div className="container">
          <div className="top">
        		<h1>{ data.title }</h1>
            <p>{ data.desc }</p>
          </div>
          <ul className="categories">
            { categories }
          </ul>
          <TransitionGroup className="view-holder">
            <CSSTransition key={ view+selectedCat } classNames="items" timeout={{ enter: 1000, exit: 500 }}>
              { view === "detailed" ? <div className="detailed-view">
                <div className="gallery-top">
                  <h2>{ selectedSingleGallery.name }</h2>
                  <NavLink to={ "/portfolio/" + selectedSingleCat.slug } className="back">x</NavLink>
                </div>
                { this.state.image > 0 ? <div className="prev" onClick={ this.setImage.bind(null, this.state.image-1) }><img src="/assets/img/chevron.png" alt="prev"/></div> : null }
                { this.selectedImages.length > 0 ? <TransitionGroup className="gallery-holder">
                  <CSSTransition key={ this.state.image } classNames="images" timeout={{ enter: 1000, exit: 500 }}>
                      <img src={ this.selectedImages[this.state.image].path } alt=""/>
                  </CSSTransition>
                </TransitionGroup> : null }
                { this.state.image < this.selectedImages.length-1 ? <div className="next" onClick={ this.setImage.bind(null, this.state.image+1) }><img src="/assets/img/chevron.png" alt="next"/></div> : null }
                <div className="gallery-small">
                  { this.state.gallery > 0 ? <div className="prev" onClick={ this.setGallery.bind(null, this.state.gallery-1) }></div> : null }
                  <div className="container">
                    <ul className="gallery-inner">
                      { this.selectedImages.map((item, i) => { return(<li key={ i } style={{ transform: "translateX(-" + this.state.gallery*100 + "%)" }} onClick={ this.showPopup.bind(null, i) }><div className="img-holder"><img src={ item.path } alt=""/></div></li>) }) }
                    </ul>
                  </div>
                  { this.state.gallery < this.selectedImages.length-offset ? <div className="next" onClick={ this.setGallery.bind(null, this.state.gallery+1) }></div> : null }
                </div>
              </div> : <div className="full-view">
                <ul className="gallery">
                  { gallery }
                </ul>
              </div> }
            </CSSTransition>
          </TransitionGroup>
      	</div>
        <Footer data={ this.props.data }/>
        <Modal open={ this.state.popup } hidePopup={ this.closePopup }>{ Popup }</Modal>
      </section>
    )
  }
}
