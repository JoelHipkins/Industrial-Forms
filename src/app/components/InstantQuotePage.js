import React from 'react'
import BaseComponent from './BaseComponent'
import Footer from './Footer'
import Helmet from 'react-helmet'
import { NavLink } from 'react-router-dom'
import InstantQuoteWidget from './InstantQuoteWidget'
import RequestQuoteWidget from './RequestQuoteWidget'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { HashLink as Link } from 'react-router-hash-link';

export default class extends BaseComponent {

  render() {
  	const data = this.props.data.instantQuote

    return (
      <section className="instant-quote">
        <Helmet>
      		<title>Industrial Forms - { data.metaTitle }</title>
          <meta name="description" content={ data.metaDesc } />

      	</Helmet>
        <img className="bg-img bg-img-1" src="/assets/img/iq-bg-img-1.png" alt="" />
        <img className="bg-img bg-img-2" src="/assets/img/iq-bg-img-2.png" alt="" />
        <img className="bg-img bg-img-3" src="/assets/img/iq-bg-img-3.png" alt="" />
        <img className="bg-img bg-img-4" src="/assets/img/iq-bg-img-4.png" alt="" />
      	<div className="container">
      		<h1 dangerouslySetInnerHTML={{ __html: data.title }}></h1>
          <div className="items-container">

          <Tabs>
    <TabList>
    <Tab><Link smooth to="#InstantQuote">Instant Quote</Link></Tab>
    <Tab><Link smooth to="#RequestQuote"> Request A Consultation</Link></Tab>
    </TabList>
    <p className="desc">{ data.desc }</p>
      <div className="d-flex">
        <div className="d-flex" id="InstantQuote"></div>
        <div className="d-flex" id="RequestQuote"></div>
      </div>
    <TabPanel>
    <div className="InstantQuote">
            <div className="instantQuoteWidget">
           <InstantQuoteWidget/>
           </div>
             </div>
    </TabPanel>
    <TabPanel>
    <div className="RequestQuote">
          <div className="requestQuoteWidget">
          <RequestQuoteWidget/>
           </div>
             </div>
        
    </TabPanel>
  </Tabs>
          </div>
      	</div>
        <Footer data={ this.props.data }/>
      </section>
    )
  }
}
