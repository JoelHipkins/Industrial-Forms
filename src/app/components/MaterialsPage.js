import React from 'react'
import BaseComponent from './BaseComponent'
import Footer from './Footer'
import Helmet from 'react-helmet'
import { NavLink } from 'react-router-dom'
import _ from 'lodash'
import ScrollReveal from 'scrollreveal'
import $ from 'jquery'

export default class extends BaseComponent {

  constructor(props) {
    super(props)
    this.sr = ScrollReveal({ reset: false, duration: 900 })
    $(window).scrollTop(0)
  }

  componentDidMount() {
    this.sr.reveal(".image", { delay: 400, origin: "left", distance: "60px" })
    this.sr.reveal(".text", { delay: 400, origin: "right", distance: "60px" })
  }

  render() {
  	const data = this.props.data.materials

    let selectedProducts = _.filter(this.props.data.products, { category: "materials" })

    let products = selectedProducts.map((item, i) => {
      return (
        <li key={ i }>
          <div className="container">
            <div className="text">
              <h2>{ item.title }</h2>
              <h4>{ item.subtitle }</h4>
              <p>{ item.short }</p>
              <NavLink to={ "/product/" + item.slug } className="btn">{ data.details }</NavLink>
            </div>
            <div className="image">
              <img src={ item.image } alt=""/>
            </div>
          </div>
        </li>
      )
    })

    return (
      <section className="materials">
        <Helmet>
      		<title>Industrial Forms - { data.metaTitle }</title>
            <meta name="description" content={ data.metaDesc } />
      	</Helmet>
      	<div className="container">
      		<h1>{ data.title }</h1>
          <h4>{ data.sub }</h4>
          <div className="desc" dangerouslySetInnerHTML={{ __html: data.desc }}></div>
      	</div>
        <ul className="products">
          { products }
        </ul>
        <Footer data={ this.props.data }/>
      </section>
    )
  }
}
