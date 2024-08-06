import React from 'react'
import BaseComponent from './BaseComponent'
import Footer from './Footer'
import Helmet from 'react-helmet'
import $ from 'jquery'
import 'parsleyjs'
import Modal from './Modal'
import { FilePond, File, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import { CompactPicker } from 'react-color'

export default class extends BaseComponent {

  constructor(props) {
  	super(props)
    this.state = {
      error: false,
      popup: false,
      modelPopup: false,
      modelInfo: {dims: {}},
      name: "",
      company: "",
      email: "",
      contact: "",
      message: "",
      files: [],
      ids: [],
      displayColorPicker: false,
      color: '#797171',
      autorotate: true,
      orientation: "front"
      
    }
  	this._bind('showPopup', 'closePopup', 'closeError', 'sendForm', 'submitForm', 'handleInputChange', 'runMailer')
    this.pond = undefined
    registerPlugin(
        FilePondPluginFileValidateType,
        FilePondPluginFileValidateSize,
        FilePondPluginImagePreview
    )
    $(window).scrollTop(0)
  }

  componentDidMount() {
    const pond = document.querySelector('.filepond--root');
    pond.addEventListener('FilePond:processfile', e => {
      
    });

  }

  handleInputChange(event) {
    const target = event.target
    let value = target.type === 'checkbox' ? target.checked : target.value
    let name = target.name

    this.setState({
      [name]: value
    })
  }

  showPopup () {
    this.setState({ popup: true })
  }

  showError () {
    this.setState({ error: true })
  }

  closePopup () {
    this.setState({ popup: false })
    this.setState({ name: "", email: "", message: "", contact: "", company: "", files: [] })
    this.pond.removeFiles()
  }

  closeError () {
    this.setState({ error: false })
    this.setState({ name: "", email: "", message: "", contact: "", company: "", files: [] })
    this.pond.removeFiles()
  }

  sendForm(e) {
    e.preventDefault()

    if($('.form-quote').parsley().validate()) {
      this.submitForm()
    }
  }

  submitForm() {
    let allHidden = document.querySelectorAll("input[type='hidden'")
    let hidden = ""
    for (var i = 0; i < allHidden.length; i++) {
      //hidden.push(allHidden[i].value)
      hidden+="filepond["+i+"]="+allHidden[i].value+"&"
    }

    let data = hidden

    $.ajax({
      url : '/fileupload/submit.php',
      type : 'POST',
      cache : false,
      data : data,
      success : (res) => {
            
        let tempfiles = this.pond.getFiles()
        let files = []
        for (var i = 0; i < tempfiles.length; i++) {
          files.push({ name: tempfiles[i].filename })
        }
        this.setState({ files: files })
        this.runMailer()
      }
    })
  }

  runMailer() {
    const data = {
      name: this.state.name,
      email: this.state.email,
      message: this.state.message,
      contact: this.state.contact,
      company: this.state.company,
      files: this.state.files,
      type: "quote"
    }

    fetch('/mailer/index.php', {
        method: "POST", 
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(data),
    })
    .then((response, status) => {
      return response.json()
    })
    .then((result) => {
      if (result.result === 0) {
        this.showError()
      } else {
        this.showPopup("success")
      }
    },(error) => {
      this.showError()
      console.log(error)
    })
  }

  set_orientation(ovalue)
  {
    var deg90 = Math.PI / 2;

    this.setState({ orientation: ovalue })

    let modelRotation = this.popup_stl_viewer.get_model_info(99).rotation
    
    let x = modelRotation.x *= -1
    let y = modelRotation.y *= -1
    let z = modelRotation.z *= -1

    this.popup_stl_viewer.rotate(99, x, y, z)
  
    switch (ovalue)
    {
      case "right":
        this.popup_stl_viewer.rotate(99, 0, -deg90, 0)
        break;

      case "left":
        this.popup_stl_viewer.rotate(99, 0, deg90, 0)
        break;

      case "top":
        this.popup_stl_viewer.rotate(99, deg90, 0, 0)
        break;

      case "bottom":
        this.popup_stl_viewer.rotate(99, -deg90, 0, 0)
        break;
        
      case "back":
        this.popup_stl_viewer.rotate(99, 0, deg90*2, 0)
        break;            
      
      default:
        this.popup_stl_viewer.rotate(99, 0, 0, 0)
    }
  }

  searchElement(name) {
    let fileInfo = document.querySelectorAll(".filepond--file-info .filepond--file-info-main")

    for (var i = 0; i < fileInfo.length; i++) {
      if (fileInfo[i].textContent === name) {
        return fileInfo[i]
      }
    }
  }

  addFilePreview(file) {
    let element = this.searchElement(file.name)
    let preview = document.createElement("DIV")
    let parent = element.parentElement
    preview.className="file-preview"
    parent.insertBefore(preview, element)
    preview.onclick = () => { this.showModelPopup(file) }
    var stl_viewer = new window.StlViewer( preview, {
          auto_rotate:true,
          bgcolor:"transparent",
          allow_drag_and_drop:false,
          //on_model_mouseclick: this.showModelPopup(file),
          models:
          [
              {local_file:file}
          ]
      } );
  }

  showModelPopup(file) {
    this.setState({ modelPopup: true })
    
    setTimeout(() => {
      let modelElement = document.getElementById("model_scene")
      this.popup_stl_viewer = new window.StlViewer( modelElement, {
          auto_rotate: this.state.autorotate,
          bgcolor: "transparent",
          allow_drag_and_drop: false,
          //on_model_mouseclick: this.showModelPopup(file),
          models:
          [
              {
                id: 99, 
                color: this.state.color,
                local_file: file
              }
          ],
          all_loaded_callback: () => {
            this.setState({ modelInfo: this.popup_stl_viewer.get_model_info(99) })
          }
      } );
    }, 500)
  }

  render() {
  	let data = this.props.data.getQuote

  	const Popup = (
      <div className="popup-inner">
        <div className="close" onClick={ this.closePopup }></div>
        <h1>{ this.props.data.contact.thankYou }</h1>
        <p>{ this.props.data.contact.messageSend }</p>
      </div>
    )

    const ErrorPopup = (
      <div className="popup-inner">
        <div className="close" onClick={ this.closeError }></div>
        <h1>{ this.props.data.contact.error }</h1>
        <p>{ this.props.data.contact.sendError }</p>
      </div>
    )

    const ModelPopup = (
      <div className="popup-inner model">
        <div className="close" onClick={ () => { this.setState({ modelPopup: false }) } }></div>
        <div className="model-holder">
          <div className="model-scene" id="model_scene"></div>
          <div className="model-tools">
            <div className="box options">
              <h4>Model info</h4>
              <p><strong>Size:</strong> { "X:" + parseInt(this.state.modelInfo.dims.x) + " Y: " + parseInt(this.state.modelInfo.dims.y) + " Z: " + parseInt(this.state.modelInfo.dims.z) }</p>
              <p><strong>Volume (mm<sup>3</sup>):</strong> { parseInt(this.state.modelInfo.volume) }</p>
              <p><strong>File units:</strong> { this.state.modelInfo.units }</p>
              <p><strong>Triangles:</strong> { this.state.modelInfo.triangles }</p>
            </div>
            <div className="box options">
              <h4>Options</h4>
              <div className="model-color-selector"><p><strong>Color:</strong></p>
                <div className="model-color-picker">
                  <div className="swatch" onClick={ () => { this.setState({ displayColorPicker: !this.state.displayColorPicker }) } }>
                    <div className="color" style={{ backgroundColor: this.state.color }}/>
                  </div>
                  { this.state.displayColorPicker ? <div className="popover">
                    <div className="cover" onClick={ () => { this.setState({ displayColorPicker: false }) } }/>
                    <CompactPicker color={ this.state.color } onChange={ (color) => { console.log(color.hex); this.setState({ color: color.hex }); this.popup_stl_viewer.set_color(99, color.hex); } } />
                  </div> : null }
                </div>
              </div>
              <p><strong>Auto-rotation: </strong> <input type="checkbox" checked={ this.state.autorotate } value={ this.state.autorotate } onChange={ () => { this.setState({ autorotate: !this.state.autorotate }); this.popup_stl_viewer.set_auto_rotate(!this.state.autorotate); }}/></p>
              <p><strong>Orientation: </strong> <select onChange={ (e) => this.set_orientation(e.target.value) }>
                  <option value="front">Front</option>
                  <option value="right">Right</option>
                  <option value="top">Top</option>
                  <option value="back">Back</option>
                  <option value="left">Left</option>
                  <option value="bottom">Bottom</option>
                </select></p>
              <p className="snap" onClick={ () => { 
                var link = document.createElement('a');
                link.download = this.state.modelInfo.name.replace(".stl", "").replace(".STL", "") + '-snap.png';
                link.href = document.querySelector('#model_scene > canvas').toDataURL()
                link.click();
               } }><strong>Snap a picture</strong></p>
            </div>
          </div>
          <h3 className="model-header">{ this.state.modelInfo.name ? this.state.modelInfo.name.replace(".stl", "").replace(".STL", "") : "" }</h3>
        </div>
      </div>
    )

    return (
      <section className="get-quote">
      	<Helmet>
      		<title>Industrial Forms - { data.metaTitle }</title>
            <meta name="description" content={ data.metaDesc } />
      	</Helmet>
        <form className="form-quote" data-parsley-validate>
        	<div className="container">
            <h1 dangerouslySetInnerHTML={{ __html: data.title }}></h1>
            <p className="sub">{ data.desc }</p>
            <div className="section-inner">
              <div className="left">
                <div className="step">
                  <h3 dangerouslySetInnerHTML={{ __html: data.step1 }}></h3>
                  <p className="tip" dangerouslySetInnerHTML={{ __html: data.step1tip }}></p>
                  <div className="upload">
                    <h4>{ data.addFile }</h4>
                    <FilePond ref={ref => this.pond = ref} server={"/fileupload/"} allowMultiple={true} maxFiles={10} instantUpload={ true } onaddfile={ (error, file) => { if(file.fileExtension.toLowerCase() === "stl") this.addFilePreview(file.file) } } allowFileTypeValidation={false} allowFileSizeValidation={true} maxTotalFileSize={'25MB'}/>
                    <p className="tip" dangerouslySetInnerHTML={{ __html: data.maxSize }}></p>
                  </div>
                </div>
                <div className="step">
                  <h3 dangerouslySetInnerHTML={{ __html: data.step2 }}></h3>
                  <textarea name="message" value={ this.state.message } onChange={ this.handleInputChange } placeholder="Please give us some details about project: &#10;What components is used for? &#10;What are material requirements? &#10;Required resolution? High. Medium, low?" required></textarea>
                  <p className="tip" dangerouslySetInnerHTML={{ __html: data.step2tip }}></p>
                </div>
              </div>
              <div className="right">
                <div className="step">
                  <h3 dangerouslySetInnerHTML={{ __html: data.step3 }}></h3>
                  <p className="tip" dangerouslySetInnerHTML={{ __html: data.step3tip }}></p>
                  <input type="text" name="name" value={ this.state.name } onChange={ this.handleInputChange } placeholder={ data.name } required/>
                  <input type="text" name="company" value={ this.state.company } onChange={ this.handleInputChange } placeholder={ data.company } required/>
                  <input type="email" name="email" value={ this.state.email } onChange={ this.handleInputChange } placeholder={ data.email } required/>
                  <input type="text" name="contact" value={ this.state.contact } onChange={ this.handleInputChange } placeholder={ data.contact} required/>
                  <div className="btn-holder">
                    <button className="btn" onClick={ this.sendForm }>{ data.send }</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        <Footer data={ this.props.data }/>
        <Modal open={ this.state.popup } hidePopup={ this.closePopup }>{ Popup }</Modal>
        <Modal open={ this.state.error } hidePopup={ this.closeError }>{ ErrorPopup }</Modal>
        <Modal open={ this.state.modelPopup } hidePopup={ () => { this.setState({ modelPopup: false }) } }>{ ModelPopup }</Modal>
      </section>
    )
  }
}
