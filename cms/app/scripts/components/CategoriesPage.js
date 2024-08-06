import React from 'react'
import BaseComponent from './BaseComponent'
import Parsley from 'parsleyjs'
import Events from '../events/events.js'
import $ from 'jquery'
import Dropzone from 'react-dropzone'
import _ from 'underscore'

class GalleryComponent extends BaseComponent {

  constructor(props) {

    super(props)
    this._bind('add', 'del', 'update', 'handleInputChange', 'onDrop', 'confirm', 'closeConfirm')
    this.state = { 
      id: this.props.item.id, 
      title: this.props.item.title, 
      slug: this.props.item.slug,
      confirm: null 
    }
    this.dispatch = this.props.dispatch
  }

  componentDidMount() {
    let _this = this
    tinymce.init({
      selector: 'textarea',
      height: 200,
      menubar: false,
      force_br_newlines : true,
      force_p_newlines : false,
      forced_root_block : '',
      language : 'pl',
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table contextmenu paste code'
      ],
      toolbar: 'undo redo | styleselect | bold | alignleft aligncenter alignright alignjustify link',
      setup : function(editor) {
        editor.on('change', function(e) {
          _this.handleInputChange(editor);
        });
      }
    });
  }

  handleInputChange(event) {
    const target = event.target
    let value = target.type === 'checkbox' ? target.checked : target.value
    let name = target.name

    if (event.type == "setupeditor") {
      value = event.getContent()
      name = event.id
    }

    this.setState({
      [name]: value
    })
  }

  onDrop(acceptedFiles) {
    this.setState({
      files: acceptedFiles
    })
  }

  confirm() {
    let item = (
      <div className="confirm">
        <p>Are you sure?</p>
        <button onClick={ this.del }>Yes</button>
        <button onClick={ this.closeConfirm }>No</button>
      </div>
    )
    this.setState({ confirm: item })
  }

  closeConfirm() {
    this.setState({ confirm: null })
  }

  del() {
    this.closeConfirm()
    this.dispatch.trigger( Events.DELETE_CATEGORIES, this.state.id )
  }

  update() {
    this.dispatch.trigger( Events.UPDATE_CATEGORIES, { 
      id: this.state.id, 
      title: this.state.title, 
      slug: this.state.slug })
  }

  add() {
    this.dispatch.trigger( Events.ADD_CATEGORIES, {
      title: this.state.title, 
      slug: this.state.slug })
  }

  changeLang(lang) {
    $(".language").hide()
    $("."+lang).show()
  }

  render() {
    if (this.props.type == "edit") {
      return (
        <li>
          <span className="id">#{ this.props.id }</span>
          <div className="language pl">
            Name: 
            <input type="text" name="title" value={ this.state.title } onChange={ this.handleInputChange }/>
            Slug: 
            <input type="text" name="slug" value={ this.state.slug } onChange={ this.handleInputChange }/>
          </div>
          <div className="btn-holder">
            <button onClick={ this.update }>Zapisz zmiany</button>
            <button onClick={ this.confirm }>Usuń</button>
          </div>
          { this.state.confirm }
        </li>
      )
    } else if (this.props.type == "new") {
      return (
        <li>
          <div className="language pl">
            Name: 
            <input type="text" name="title" value={ this.state.title } onChange={ this.handleInputChange }/>
            Slug: 
            <input type="text" name="slug" value={ this.state.slug } onChange={ this.handleInputChange }/>
          </div>
          <div className="btn-holder">
            <button onClick={ this.add }>Dodaj</button>
          </div>
        </li>
      )
    }
  }
}

export default class extends BaseComponent {

  constructor(props) {

    super(props)
    this._bind('openEdit', 'hidePopup', 'confirm', 'closeConfirm', 'openAdd', 'moveUp', 'moveDown', 'changeLang', 'openPhotos', 'onDropImages', 'hidePhotosPopup', 'addPhotos', 'delPhoto')
    this.state = { popup: null,  photosPopup: false, albumId: null, files: [], confirm: null }
    this.dispatch = this.props.dispatch
    this.dispatch.trigger( Events.GET_CATEGORIES )
    this.dispatch.on( Events.UPDATE_SUCCESS, this.hidePopup )
  }

  openEdit(categories, id) {
    let item = (
      <div className="popup">
        <div className="popup-inner">
          <h2>Edit</h2>
          <div className="close" onClick={ this.hidePopup }></div>
          <ul className="price-holder">
            <GalleryComponent type="edit" item={ categories } id={ id } dispatch={ this.dispatch }/>
          </ul>
        </div>
      </div>
    )
    this.setState({ popup: item })
  }

  openAdd() {
    let item = (
      <div className="popup">
        <div className="popup-inner">
          <h2>Add</h2>
          <div className="close" onClick={ this.hidePopup }></div>
          <ul className="price-holder">
            <GalleryComponent type="new" item={ { id: 0, title: "", slug:"", image: "" } } dispatch={ this.dispatch }/>
          </ul>
        </div>
      </div>
    )
    this.setState({ popup: item })
  }

  confirm(id) {
    let item = (
      <div className="confirm">
        <p>Are you sure?</p>
        <button onClick={ this.delPhoto.bind(null, id) }>Yes</button>
        <button onClick={ this.closeConfirm }>No</button>
      </div>
    )
    this.setState({ confirm: item })
  }

  closeConfirm() {
    this.setState({ confirm: null })
  }

  hidePopup() {
    if (this.state.popup != null) {
      this.setState({ popup: null })
    }
  }

  openPhotos(id) {
    this.setState({ photosPopup: true, albumId: id })
  }

  onDropImages(acceptedFiles) {
    this.setState({
      files: acceptedFiles
    })
  }

  hidePhotosPopup() {
    this.setState({ photosPopup: false, files: [] })
  }

  addPhotos() {
    this.dispatch.trigger( Events.ADD_IMAGES, this.state.albumId, this.state.files )
  }

  delPhoto(id) {
    this.closeConfirm()
    this.dispatch.trigger( Events.DELETE_IMAGES, id )
  }

  moveUp(id, prevId) {
    this.dispatch.trigger( Events.MOVE_UP, { table: 'categories', id: id, prevId: prevId } )
  }

  moveDown(id, nextId) {
    this.dispatch.trigger( Events.MOVE_DOWN, { table: 'categories', id: id, nextId: nextId } )
  }

  changeLang(lang) {
    $(".language").hide()
    $("."+lang).show()
  }

  render() {
    let images = _.where(this.props.images, { news_id: this.state.albumId })
    let selectedImages = []
    for (var i = 0; i < images.length; i++) {
      let item = (<li key={ i }><div className="img uploaded" style={{ backgroundImage: "url(" + images[i].thumb + ")" }}><div className="del" onClick={ this.confirm.bind(null, images[i].id) }>Delete</div></div></li>)
      selectedImages.push(item)
    }

    let categories = []
    if (this.props.categories !== null) {
      for (var i = 0; i < this.props.categories.length; i++) {
        let item = (
          <li key={ i }>
            <span className="id">#{ i+1 }</span>
            <div className="order">
              { i > 0 ? <div className="up" onClick={ this.moveUp.bind(null, this.props.categories[i].ord, this.props.categories[i-1].ord ) }></div> : "" }
              { i < this.props.categories.length-1 ? <div className="down" onClick={ this.moveDown.bind(null, this.props.categories[i].ord, this.props.categories[i+1].ord ) }></div> : "" }
            </div>
            <div className="content">
              <div className="language pl">
                <div>Name: { this.props.categories[i].title }</div><br/>
                <div>Slug: { this.props.categories[i].slug }</div><br/>
              </div>
            </div>
            <div className="btn-holder">
              <button onClick={ this.openEdit.bind(null, this.props.categories[i], i+1) }>Edit</button>
            </div>
          </li>
        )
        categories.push(item)
      }
    }

    return (
      <section className="news">
        <h2>Portfolio - categories</h2>
        <div className="news-container">
          <button onClick={ this.openAdd }>Add new category</button>
          <ul className="price-holder">
            { categories }
          </ul>
        </div>
        { this.state.popup }
        { this.state.confirm }
      </section>
    )
  }
}
