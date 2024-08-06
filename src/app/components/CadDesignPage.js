import React from 'react'
import BaseComponent from './BaseComponent'
import Footer from './Footer'
import Helmet from 'react-helmet'
import $ from 'jquery'

export default class extends BaseComponent {

  render() {
  	const data = this.props.data.cadDesign

    $(window).scrollTop(0)

    return (
      <section className="cad-design">
        <Helmet>
      		<title>Industrial Forms - { data.metaTitle }</title>
            <meta name="description" content={ data.metaDesc } />
      	</Helmet>
      	<div className="container">
      		<h1>{ data.title }</h1>
          <div dangerouslySetInnerHTML={{ __html: data.desc }}></div>
          <ul className="list">
            { data.list.map((item, i) => { return ( <li key={ i }>{ item }</li> ) }) }
          </ul>
          <div className="image"><img className="cad-img" alt="" src="/assets/img/cad-design-img.png"/></div>
      	</div>
        <div className="bottom">
          <div className="container">
            <h3>{ data.offer }</h3>
            <ul className="items">
              { data.items.map((item, i) => { return ( <li key={ i }><img src={ item.icon } alt=""/><h4>{ item.name }</h4><p>{ item.desc }</p><img className="next" src="/assets/img/arrows-right.png" alt=""/></li> ) }) }
            </ul>
          </div>
        </div>
        <Footer data={ this.props.data }/>
      </section>
    )
  }
}
