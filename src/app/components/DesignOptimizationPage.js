import React from 'react'
import BaseComponent from './BaseComponent'
import Footer from './Footer'
import Helmet from 'react-helmet'
import $ from 'jquery'

export default class extends BaseComponent {

  render() {
    const data = this.props.data.designOptimization
    
    $(window).scrollTop(0)

    return (
      <section className="design-optimization">
        <Helmet>
      		<title>Industrial Forms - { data.metaTitle }</title>
            <meta name="description" content={ data.metaDesc } />
      	</Helmet>
      	<div className="container">
      		<h1>{ data.title }</h1>
          <p className="desc" dangerouslySetInnerHTML={{ __html: data.desc }}></p>
          <div className="content" dangerouslySetInnerHTML={{ __html: data.content }}></div>
          <div className="image"><img className="cad-img" alt="" src="/assets/img/design-img.png"/></div>
      	</div>
        <Footer data={ this.props.data }/>
      </section>
    )
  }
}
