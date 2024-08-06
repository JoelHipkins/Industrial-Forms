import React, { Component } from 'react'
import Modal from 'react-modal'

export default class extends Component {

  constructor(props) {

    super(props)
    this.dispatch = this.props.dispatch
    Modal.setAppElement('#app')
  }

  render() {

    return (
      <Modal
        isOpen={ this.props.open } 
        contentLabel="Modal" 
        className={{
          base: 'modal',
          afterOpen: 'modal_after-open',
          beforeClose: 'modal_before-close'
        }}
        overlayClassName={{
          base: 'overlay',
          afterOpen: 'overlay_after-open',
          beforeClose: 'overlay_before-close'
        }} 
        onRequestClose={ () => { this.props.hidePopup() } } 
        closeTimeoutMS={ 1000 }
      >
        { this.props.children }
      </Modal>
    )
  }
}
