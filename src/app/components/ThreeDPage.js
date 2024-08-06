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
    $(window).scrollTop(0)
  }

  componentDidMount() {
    this.sr.reveal(".items li", { delay: 400, origin: "right", distance: "60px", interval: 100 })
    this.sr.reveal("h1, p, .btn", { delay: 400, origin: "left", distance: "60px" })
  }

  render() {
  	const data = this.props.data.threed

    return (
      <section className="threed-print">
        <Helmet>
      		<title>Industrial Forms - { data.metaTitle }</title>
            <meta name="description" content={ data.metaDesc } />
      	</Helmet>
        <img className="bg-img" src="/assets/img/td-bg-img.png" alt=""/>
      	<div className="container">
      		<h1 dangerouslySetInnerHTML={{ __html: data.title }}></h1>
          <p className="desc">{ data.desc }</p>
          <div className="items-container">
            <ul className="items">
              <li>
                <div className="bg"></div>
                <div className="img">
                  <img src="/assets/img/td-icon-1.png" alt=""/>
                </div>
                <h2 dangerouslySetInnerHTML={{ __html: data.materials }}></h2>
                <p>{ data.materialsDesc }</p>
                <NavLink to="/3d-print/materials" className="btn">{ data.btnText }</NavLink>
              </li>
              <li>
                <div className="img">
                  <img src="/assets/img/td-icon-2.png" alt=""/>
                </div>
                <h2 dangerouslySetInnerHTML={{ __html: data.processes }}></h2>
                <p>{ data.processesDesc }</p>
                <NavLink to="/3d-print/processes" className="btn">{ data.btnText }</NavLink>
              </li>
            </ul>
          </div>
      	</div>
        <Footer data={ this.props.data }/>
      </section>
    )
  }
}
