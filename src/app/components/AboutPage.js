import React from 'react'
import BaseComponent from './BaseComponent'
import Footer from './Footer'
import Helmet from 'react-helmet'
import { NavLink } from 'react-router-dom'
import ScrollReveal from 'scrollreveal'
import $ from 'jquery'

export default class extends BaseComponent {

  constructor(props) {
    super(props)
	this.sr = ScrollReveal({ reset: false, duration: 900 })
	$(window).scrollTop(0);
  }

  componentDidMount() {
    this.sr.reveal(".image img", { delay: 400, origin: "right", distance: "60px" })
    this.sr.reveal(".box", { delay: 200, origin: "left", distance: "60px" })
    this.sr.reveal(".line", { delay: 200, origin: "left", distance: "60px" })
  }

  render() {
  	const data = this.props.data.about

    return (
      <section className="about">
        <Helmet>
      		<title>Industrial Forms - { data.metaTitle }</title>
            <meta name="description" content={ data.metaDesc } />
      	</Helmet>
      	<div className="container">
      		<div className="text">
      			<h1 dangerouslySetInnerHTML={{ __html: data.title }}></h1>
      			<p dangerouslySetInnerHTML={{ __html: data.p1 }}></p>
      			<p dangerouslySetInnerHTML={{ __html: data.p2 }}></p>
      			<div className="box">
      				<h4>{ data.p3title }</h4>
      				<p>{ data.p3 }</p>
      			</div>
      			<NavLink to="/portfolio" className="btn">{ data.btn }</NavLink>
      		</div>
      		{ this.props.screen.width < 1020 ? <img className="bg-image-mobile" src="/assets/img/about-img.png" alt=""/> : <div className="image">
      			<img className="bg-image-desktop" src="/assets/img/about-img.png" alt=""/>
      			<img className="bg-image-desktop-layer" src="/assets/img/about-img-layer.png" alt=""/>
      			<div className="line"><div className="right-line"></div><span className="right-text">{ data.rightText }</span></div>
      		</div> }
      	</div>
        <Footer data={ this.props.data }/>
      </section>
    )
  }
}
