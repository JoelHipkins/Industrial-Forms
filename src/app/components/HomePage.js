import React from 'react'
import BaseComponent from './BaseComponent'
import Footer from './Footer'
import Helmet from 'react-helmet'
import $ from 'jquery'
import 'parsleyjs'
import { NavLink } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Modal from './Modal'
import _ from 'lodash'
import ScrollReveal from 'scrollreveal'
import Scroll from 'react-scroll'
import { HashLink as Link } from 'react-router-hash-link';

let scroller = Scroll.scroller
let Element = Scroll.Element


  
export default class extends BaseComponent {

  constructor(props) {
    super(props)
    this.state = { slider: 0, popup: false, popupType: "", selectedCat: "automotive", image: 0, gallery: 0, name: "", email: "", message: "" }
    this._bind('setSlide', 'showPopup', 'closePopup', 'changeCategory', 'setGallery', 'scrollTo', 'sendForm', 'submitForm', 'handleInputChange')
    this.selectedGallery = []
    this.sr = ScrollReveal({ reset: false, duration: 900 })
    $(window).scrollTop(0)
  }

  componentDidMount() {
    this.timer = setTimeout(this.setSlide.bind(null, this.state.slider+1), 9000)

    this.sr.reveal(".image img", { delay: 400, origin: "bottom", distance: "60px" })
    this.sr.reveal(".title-box h2", { delay: 200, origin: "left", distance: "60px" })
    this.sr.reveal(".items li, .what-we-are-about-items li", { delay: 400, origin: "right", distance: "60px", interval: 100 })
  }

  scrollTo(el) {
    scroller.scrollTo(el, {
      duration: 1500,
      delay: 100,
      smooth: "easeInOutQuad",
      offset: -120
    })
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  showPopup (type, image) {
    this.setState({ popup: true, popupType: type, image: image })
  }

  closePopup () {
    this.setState({ popup: false, name: "", email: "", message: "" })
  }

  setSlide(i) {
    if (i >= 0 && i < this.props.data.home.slider.length) {
      this.setState({ slider: i })
    } else {
      this.setState({ slider: 0 })
    }
    clearTimeout(this.timer)
    this.timer = setTimeout(this.setSlide.bind(null, this.state.slider+1), 9000)
  }

  setGallery(i) {
    if (i >= 0 && i < this.selectedGallery.length) {
      this.setState({ gallery: i })
    }
  }

  changeCategory(cat) {
    this.setState({ selectedCat: cat, image: 0, gallery: 0 })
  }

  handleInputChange(event) {
    const target = event.target
    let value = target.type === 'checkbox' ? target.checked : target.value
    let name = target.name

    this.setState({
      [name]: value
    })
  }

  sendForm(e) {
    e.preventDefault()

    if($('.form-home').parsley().validate()) {
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
        this.showPopup("failed")
      } else {
        this.showPopup("success")
      }
    },(error) => {
      this.showPopup("failed")
      console.log(error)
    })
  }

  render() {
  	const data = this.props.data.home

    let selectedSingleCat = _.filter(this.props.data.categories, { slug: this.state.selectedCat })[0]

    let selectedCatId = selectedSingleCat.id

    this.selectedGallery = _.filter(this.props.data.portfolio, { parent: selectedCatId }) || []

    let categories = this.props.data.categories.map((item, i) => {
      return (
        <li key={ i }><a  className={ this.state.selectedCat === item.slug ? "active" : "" } onClick={ this.changeCategory.bind(null, item.slug) }>{ item.title }</a></li>
      )
    })

    let offset = 2
    if (this.props.screen.width > 1280) {
      offset = 3
    }

    let Popup

    if (this.state.popupType === "needs") {
      Popup = (
        <div className="popup-inner">
          <div className="close" onClick={ this.closePopup }><span>{ data.close }</span></div>
          <h4>Your NEEDS</h4>
          <p>3D Printing Services - getting your products to market effectively and efficiently. We can put a functional prototype in your hands quickly, often in days. Using in house 3D printers to make a prototype accurate in form and function, we regularly deliver parts and products to clients like you. Further, we can make one-offs, assemblies, fully embodied products or even small production runs of parts using either AM or conventional means: CNC and RIM processes. With RIM, we are able to produce high performance plastic parts – impact resistant, UV-stable, environmentally fit for purpose. With 3, 4, 5 axis CNC we can deliver parts machined in steels, lasting for years. Get in touch for free quote !</p>
        </div>
      )
    } else if (this.state.popupType === "who") {
      Popup = (
        <div className="popup-inner">
          <div className="close" onClick={ this.closePopup }><span>{ data.close }</span></div>
          <h4>Your manufacturing process</h4>
          <ul className="list">
            <li>Design tooling, fixtures, gauges, flushing blocks and jigs</li>
          </ul>
          <h4>Your part</h4>
          <ul className="list">
            <li>Prototype design and manufacturing</li>
            <li>Low volume 1-1000 fully functional parts made in ABS, NILON, PET-G, PLA, HIPS</li>
            <li>Lower down cost of the product life cycle</li>
            <li>Replacement of injection moulding technologies ( there is no cost of injection moulding tool) Extremally quick lead times, often 24hours service, can help you with break down, quick replacement and most competitive production runs in volume 1-1000 off</li>
          </ul>
          <h4>Your part</h4>
          <ul className="list">
            <li>Combine multiple components into one single item. Huge savings across product lifecycle</li>
            <li>Impossible make possible. Ultimate design freedom to achieve best performance, lower weight, and shape</li>
            <li>Using the most advanced materials: polymers, resins, and even steels</li>
          </ul>
        </div>
      )
    } else if (this.state.popupType === "what") {
      Popup = (
        <div className="popup-inner">
          <div className="close" onClick={ this.closePopup }><span>{ data.close }</span></div>
          <h4>3D Print Engineering from process, part to product.</h4>
          <ul className="list">
            <li>We can make your things – using Additive Manufacturing and conventional
            processes, cheaper and more accessible than ever before! We are about
            implementing Additive Manufacturing / 3D-Printing into any industry, helping you benefit from this enabling technology. We work with anyone: from individuals to engineering design and manufacturing teams; artists and designers,
            to engineering departments of well-known household names.</li>
          </ul>
          <h4>What is your requirement:</h4>
          <ul className="list">
            <li>Getting parts made for a project,</li>
            <li>A retro-fit part, like a replacement switch gear for a classic car,</li>
            <li>A low volume production run to test the market,</li>
            <li>A complex part that could only be made by additive manufacturing?</li>
          </ul>
          <p>3D Printing could benefit your development and manufacturing processes. 
          If you need components relatively quickly and cheaply, AM is effective. 
          If you need to explore a product family AM can offer a solution that will delight you in terms of how quickly and cheaply this can be accomplished.
          If you need help with product development and design for production we can help, this service is proving popular.</p>
          <p>See how Industrial Forms have helped others</p>
          <div className="btn-holder"><NavLink to="/portfolio" className="btn white" onClick={ this.closePopup }>Portfolio</NavLink></div>
        </div>
      )
    } else if(this.state.popupType === "portfolio") {
      Popup = (
      <div className="popup-inner gallery">
        <div className="close" onClick={ this.closePopup }><span>Close</span></div>
        { this.state.image > 0 ? <div className="prev" onClick={ this.showPopup.bind(null, "portfolio", this.state.image-1) }></div> : null }
        <img src={ this.selectedGallery.length > 0 ? this.selectedGallery[this.state.image].image : "" } alt=""/>
        { this.state.image < this.selectedGallery.length-1 ? <div className="next" onClick={ this.showPopup.bind(null, "portfolio", this.state.image+1) }></div> : null }
      </div>
    )
    } else if(this.state.popupType === "success") {
      Popup = (
      <div className="popup-inner">
        <div className="close" onClick={ this.closePopup }></div>
        <h1>{ this.props.data.contact.thankYou }</h1>
        <p>{ this.props.data.contact.messageSend }</p>
      </div>
    )
    } else if(this.state.popupType === "failed") {
      Popup = (
      <div className="popup-inner">
        <div className="close" onClick={ this.closePopup }></div>
        <h1>{ this.props.data.contact.error }</h1>
        <p>{ this.props.data.contact.sendError }</p>
      </div>
    )
    }

    let slider = data.slider.map((item, i) => {
      return (
        <li key={ i } className={ this.state.slider === i ? "slider-item active" : "slider-item" }>
          
          <div className="text">
          <div className="image">
            <img src={ item.image } alt=""/>
          </div>
            <h1 dangerouslySetInnerHTML={{ __html: item.title }}></h1>
            <div dangerouslySetInnerHTML={{ __html: item.desc }}></div>
            <NavLink to={ item.link } className="btn">{ item.btnText }</NavLink>
          </div>
        </li>

      )
    })

    let dots = data.slider.map((item, i) => {
      return (
        <li key={ i } className={ this.state.slider === i ? "dot active" : "dot" } onClick={ this.setSlide.bind(null, i) }></li>
      )
    })

    return (
      <section className="home">
        <Helmet>
      		<title>Industrial Forms - { data.metaTitle }</title>
            <meta name="description" content={ data.metaDesc } />
      	</Helmet>
        <div className="home-slider">
          <div className="container">
            <div className="slider-main">
            <ul className="slider-inner">
              { slider }
            </ul>
            <ul className="dots">
              { dots }
            </ul>
        </div>

        <div className="slider-instant-quote">
            <div className="instant-quote">
                <div className="instant-quote-box">
                <h2><Link to="/get-instant-quote#InstantQuote">Get An Instant Quote</Link></h2>
                    <div className="bg-border"></div>
                </div>
            </div>
        </div>
   
          {/* <div className="slider-widget">
            <div className="slider-widget-iframe">
            <SliderWidget/>
            </div>
          </div> */}

          </div>
        </div>

        <div className="who-we-are">
          <div className="container">
            <div className="title-box">
              <h2>{ data.whoWeAre.title }</h2>
              <div className="bg-border"></div>
            </div>
            <div className="text">
              <h4 dangerouslySetInnerHTML={{ __html: data.whoWeAre.sub }}></h4>
              <p dangerouslySetInnerHTML={{ __html: data.whoWeAre.desc }}></p>
              <button className="btn" onClick={ this.scrollTo.bind(null, "contact") }>{ data.whoWeAre.btnText }</button>
            </div>
          </div>
          <div className="bottom-right-line"></div>
        </div>
        <div className="what-we-are-about">
          <div className="container">
            <div className="title-box">
              <h2>{ data.whatWeAreAbout.title }</h2>
              <div className="bg-border"></div>
            </div>
            <div className="what-we-are-about-inner">
              <div className="text">
                <p dangerouslySetInnerHTML={{ __html: data.whatWeAreAbout.desc }}></p>
                <button className="btn" onClick={ this.showPopup.bind(null, "what") }>{ data.whatWeAreAbout.btnText }</button>
                <ul className="what-we-are-about-items">
                  { data.whatWeAreAbout.items.map((item, i) => { return ( <li key={ i }><img src={ item.icon } alt=""/><p>{ item.name }</p></li> ) }) }
                </ul>
              </div>
              <div className="image">
                <img src="/assets/img/home-what-image.png" alt=""/>
              </div>
            </div>
          </div>
          <div className="bottom-left-line"></div>
        </div>
        <div className="home-3d-print">
          <img className="bg-top" src="/assets/img/home-3d-bg-top.png" alt=""/>
          <img className="bg-image-1" src="/assets/img/bg-img-3d-1.png" alt=""/>
          <img className="bg-image-2" src="/assets/img/bg-img-3d-2.png" alt=""/>
          <div className="container">
            <div className="title-box">
              <h2>{ data.threed.title }</h2>
              <div className="bg-border"></div>
            </div>
            <div className="right-text" dangerouslySetInnerHTML={{ __html: data.threed.desc }}></div>
            <ul className="items">
              { data.threed.items.map((item, i) => { return ( <li key={ i }><img className="icon" src={ item.icon } alt=""/><div className="txt"><h4>{ item.title }</h4><p>{ item.desc }</p></div><NavLink to={ item.link } className="btn white">{ item.btnText }</NavLink></li> ) }) }
            </ul>
          </div>
          <div className="bottom-right-line"></div>
          <img className="bg-bottom" src="/assets/img/home-3d-bg-bottom.png" alt=""/>
        </div>
        <div className="home-development">
          <div className="container">
            <div className="title-box">
              <h2>{ data.dev.title }</h2>
              <div className="bg-border"></div>
            </div>
            <div className="text">
              <h3>{ data.dev.sub }</h3>
              <p>{ data.dev.desc }</p>
              <button className="btn white" onClick={ this.showPopup.bind(null, "needs") }>{ data.dev.btnText }</button>
            </div>
            <ul className="items">
              { data.dev.items.map((item, i) => { return ( <li key={ i }><img className="icon" src={ item.icon } alt=""/><div className="txt"><h4>{ item.title }</h4><p>{ item.desc }</p></div><NavLink to={ item.link } className="btn white">{ item.btnText }</NavLink><div className="separator"></div></li> ) }) }
            </ul>
            <div className="steps">
              <div className="txt">
                <h3>{ data.dev.sub2 }</h3>
                <p>{ data.dev.desc2 }</p>
              </div>
              <ul className="list">
                { data.dev.list.map((item, i) => { return ( <li key={ i }>{ item }</li> ) }) }
              </ul>
            </div>
            <h3 className="nda">{ data.dev.nda }</h3>
            <p className="design">{ data.dev.design }</p>
            <ul className="add">
              { data.dev.add.map((item, i) => { return ( <li key={ i }>{ item }</li> ) }) }
            </ul>
          </div>
          <div className="middle-right-line"></div>
          <div className="bottom-left-line"></div>
        </div>
        <div className="man-process">
          <div className="container">
            <h4>{ data.manProcess.title }</h4>
            <p>{ data.manProcess.desc }</p>
            <ul className="items">
              { data.manProcess.items.map((item, i) => { return ( <li key={ i }><img src={ item.icon } alt=""/><h4>{ item.name }</h4><div className="separator"></div></li> ) }) }
            </ul>
          </div>
          <div className="bottom-right-line"></div>
        </div>
        <div className="home-portfolio">
          <div className="container">
            <div className="title-box">
              <h2>{ data.portfolio.title }</h2>
              <div className="bg-border"></div>
            </div>
            <ul className="categories">
              { categories }
            </ul>
          </div>
          <TransitionGroup className="view-holder">
            <CSSTransition key={ this.state.selectedCat } classNames="items" timeout={{ enter: 1000, exit: 500 }}>
              <div className="gallery-small">
                { this.state.gallery > 0 ? <div className="prev" onClick={ this.setGallery.bind(null, this.state.gallery-1) }></div> : null }
                <div className="container">
                  <ul className="gallery-inner">
                    { this.selectedGallery.map((item, i) => { return(<li key={ i } style={{ transform: "translateX(-" + this.state.gallery*100 + "%)" }} onClick={ this.showPopup.bind(null, "portfolio", i) }><div className="img-holder"><img src={ item.image } alt=""/></div></li>) }) }
                  </ul>
                </div>
                { this.state.gallery < this.selectedGallery.length-offset ? <div className="next" onClick={ this.setGallery.bind(null, this.state.gallery+1) }></div> : null }
              </div>
            </CSSTransition>
          </TransitionGroup>
          <div className="btn-holder"><NavLink to="/portfolio" className="btn">{ data.portfolio.btnText }</NavLink></div>
        </div>
        <div className="home-contact">
          <Element name="contact"/>
          <div className="container">
            <div className="title-box">
              <h2>{ this.props.data.contact.title }</h2>
              <div className="bg-border"></div>
            </div>
            <div className="home-contact-inner">
              <div className='left'>
                <div>
                  <h3><span>{ this.props.data.contact.phone }</span></h3>
                  <a href={ "tel:" + this.props.data.contact.phoneNo }>{ this.props.data.contact.phoneNo }</a>
                </div>
                <div>
                  <h3>{ this.props.data.contact.location }</h3>
                  <p dangerouslySetInnerHTML={{ __html: this.props.data.contact.contactData }}></p>
                </div>
              </div>
              <div className="right">
                <form className="form-home" data-parsley-validate>
                  <div className="inputs">
                <input type="text" name="name" value={ this.state.name } placeholder={ this.props.data.contact.name } onChange={ this.handleInputChange } required/>
                <input type="email" name="email" value={ this.state.email } placeholder={ this.props.data.contact.email } onChange={ this.handleInputChange } required/>
              </div>
              <textarea placeholder={ this.props.data.contact.inquiry } name="message" value={ this.state.message } onChange={ this.handleInputChange } required></textarea>
                  <div className="btn-holder">
                    <button className="btn white" onClick={ this.sendForm }>{ this.props.data.contact.send }</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer data={ this.props.data }/>
        <Modal open={ this.state.popup } hidePopup={ this.closePopup }>{ Popup }</Modal>
      </section>
    )
  }
}
