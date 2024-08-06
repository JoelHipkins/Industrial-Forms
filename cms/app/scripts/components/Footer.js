import React from 'react'
import BaseComponent from './BaseComponent'

export default class extends BaseComponent {

  constructor(props) {

    super(props)
  }

  render() {

    return (
      <footer className={ this.props.sticky }>
        <div className="copyrights">© 2017 <a href="http://virtualpeople.pl/" target="_blank" data-bypass><b>virtual people</b></a></div>
      </footer>
    )
  }
}
