import React, { Component } from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Helmet from 'react-helmet'
import Header from './components/Header'
import Cookies from './components/Cookies'
import ErrorPage from './components/ErrorPage'
import HomePage from './components/HomePage'
import ContactPage from './components/ContactPage'
import GetQuotePage from './components/GetQuotePage'
import InstantQuotePage from './components/InstantQuotePage'
import PortfolioPage from './components/PortfolioPage'
import AboutPage from './components/AboutPage'
import DevelopmentPage from './components/DevelopmentPage'
import ThreeDPage from './components/ThreeDPage'
import CadDesignPage from './components/CadDesignPage'
import DesignOptimizationPage from './components/DesignOptimizationPage'
import AdditiveProductionPage from './components/AdditiveProductionPage'
import MaterialsPage from './components/MaterialsPage'
import ProcessesPage from './components/ProcessesPage'
import ProductPage from './components/ProductPage'
import '../style.css'

class MainView extends Component {

  constructor(props) {
    super(props)
    this.state = { screen : { width: window.innerWidth, height: window.innerHeight }}
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this))
    if (typeof window.ga === 'function') {
      window.ga('set', 'page', this.props.location.pathname + this.props.location.search);
      window.ga('send', 'pageview');
    }
  }

  // scrollTop() {
  //   document.body.scrollTop = 0
  //   document.documentElement.scrollTop = 0
  // }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.location !== this.props.location) {
  //     setTimeout(this.scrollTop, 400)
  //     if (typeof window.ga === 'function') {
  //       window.ga('set', 'page', nextProps.location.pathname + nextProps.location.search);
  //       window.ga('send', 'pageview');
  //     }
  //   }
  // }

  handleResize(e) {
    this.setState({ screen : { width: window.innerWidth, height: window.innerHeight }})
  }

  render() {

    let key = this.props.location.pathname

    if (key.indexOf('portfolio') !== -1) {
      key = "portfolio"
    }

    return (
      <div className="app-inner">
        <Helmet>
          <title>{ this.props.data.metaTitle }</title>
            <meta name="description" content={ this.props.data.metaDesc } />
        </Helmet>
        <Header data={ this.props.data }/>
        <TransitionGroup>
          <CSSTransition key={ key } classNames="page" timeout={{ enter: 1000, exit: 500 }} >
            <Switch location={ this.props.location }>
              <Route  path="/" exact render={(props) => (<HomePage data={ this.props.data } screen={ this.state.screen } location={ this.props.location } />)}/>
              <Route  path="/contact" exact render={(props) => (<ContactPage data={ this.props.data } screen={ this.state.screen } location={ this.props.location } />)}/>
              <Route  path="/get-quote" exact render={(props) => (<GetQuotePage data={ this.props.data } screen={ this.state.screen } location={ this.props.location } />)}/>
              <Route  path="/get-instant-quote" exact render={(props) => (<InstantQuotePage data={ this.props.data } screen={ this.state.screen } location={ this.props.location } />)}/>
              <Route  path="/development" exact render={(props) => (<DevelopmentPage data={ this.props.data } screen={ this.state.screen } location={ this.props.location } />)}/>
              <Route  path="/development/cad-design" exact render={(props) => (<CadDesignPage data={ this.props.data } screen={ this.state.screen } location={ this.props.location } />)}/>
              <Route  path="/development/design-optimization" exact render={(props) => (<DesignOptimizationPage data={ this.props.data } screen={ this.state.screen } location={ this.props.location } />)}/>
              <Route  path="/development/additive-production" exact render={(props) => (<AdditiveProductionPage data={ this.props.data } screen={ this.state.screen } location={ this.props.location } />)}/>
              <Route  path="/3d-print" exact render={(props) => (<ThreeDPage data={ this.props.data } screen={ this.state.screen } location={ this.props.location } />)}/>
              <Route  path="/3d-print/materials" exact render={(props) => (<MaterialsPage data={ this.props.data } screen={ this.state.screen } location={ this.props.location } />)}/>
              <Route  path="/3d-print/processes" exact render={(props) => (<ProcessesPage data={ this.props.data } screen={ this.state.screen } location={ this.props.location } />)}/>
              <Route  path="/portfolio/:category?/:album?" exact render={(props) => (<PortfolioPage data={ this.props.data } screen={ this.state.screen } location={ this.props.location } {...props}/>)}/>
              <Route  path="/product/:name" exact render={(props) => (<ProductPage data={ this.props.data } screen={ this.state.screen } location={ this.props.location } {...props}/>)}/>
              <Route  path="/about-us" exact render={(props) => (<AboutPage data={ this.props.data } screen={ this.state.screen } location={ this.props.location } />)}/>
              <Route render={(props) => (<ErrorPage data={ this.props.data }/>)} />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
        <Cookies data={ this.props.data }/>
      </div>
    )
  }
}

export default withRouter(MainView)