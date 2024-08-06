import React from 'react'
import BaseComponent from './BaseComponent'

export default class extends BaseComponent {

  constructor(props) {

    super(props)
  }

  render() {

    return (
      <section className="error">
        <div className="page-inner"> 
      		<h2>error</h2>
      	</div>
      </section>
    )
  }
}
