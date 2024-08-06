import React from 'react'
import BaseComponent from './BaseComponent'
import Footer from './Footer'
import Helmet from 'react-helmet'
import $ from 'jquery'

export default class extends BaseComponent {

  render() {
    const data = this.props.data.additiveProduction
    
    $(window).scrollTop(0)
    
    return (
      <section className="additive-production">
        <Helmet>
      		<title>Industrial Forms - { data.metaTitle }</title>
            <meta name="description" content={ data.metaDesc } />
      	</Helmet>
      	<div className="container">
      		<h1>{ data.title }</h1>
          <p className="desc" dangerouslySetInnerHTML={{ __html: data.desc }}></p>
          <p className="email">{ data.email }</p>
          <div className="adv">
            <h4 dangerouslySetInnerHTML={{ __html: data.advantages }}></h4>
          </div>
          <ul className="list">
            { data.items.map((item, i) => { return ( <li key={ i }>{ item }</li> ) }) }
          </ul>
          <div className="images">
            <img src="/assets/img/additive-production-1.jpg" alt=""/>
            <img src="/assets/img/additive-production-2.jpg" alt=""/>
          </div>
      	</div>
        <Footer data={ this.props.data }/>
      </section>
    )
  }
}
