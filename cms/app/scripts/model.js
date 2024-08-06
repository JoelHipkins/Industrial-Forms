'use strict'

import _ from 'underscore'
import $ from 'jquery'
import Backbone from 'backbone'
import Events from './events/events.js'

export default class Model extends Backbone.Model {

	initialize(options) {
		this.dispatch = options.dispatch

		this.API_URL = '../api/'
		this.COOKIE_DAYS = 1

		this.initEvents()
	}

	initEvents() {
		this.dispatch.on( Events.CHECK_LOGIN, this.checkLogin.bind(this) )
		this.dispatch.on( Events.LOGIN, this.login.bind(this) )
		this.dispatch.on( Events.LOGOUT, this.logout.bind(this) )

		this.dispatch.on( Events.PUBLISH, this.publish.bind(this) )

		this.dispatch.on( Events.MOVE_UP, this.moveUp.bind(this) )
		this.dispatch.on( Events.MOVE_DOWN, this.moveDown.bind(this) )

		this.dispatch.on( Events.GET_USER_DATA, this.userData.bind(this) )
		this.dispatch.on( Events.UPDATE_USER_DATA, this.updateUserData.bind(this) )
		this.dispatch.on( Events.UPDATE_USER_PASSWORD, this.updateUserPassword.bind(this) )

		this.dispatch.on( Events.GET_GALLERY, this.getGallery.bind(this) )
		this.dispatch.on( Events.DELETE_GALLERY, this.deleteGallery.bind(this) )
		this.dispatch.on( Events.UPDATE_GALLERY, this.updateGallery.bind(this) )
		this.dispatch.on( Events.ADD_GALLERY, this.addGallery.bind(this) )

		this.dispatch.on( Events.GET_PRODUCTS, this.getProducts.bind(this) )
		this.dispatch.on( Events.DELETE_PRODUCTS, this.deleteProducts.bind(this) )
		this.dispatch.on( Events.UPDATE_PRODUCTS, this.updateProducts.bind(this) )
		this.dispatch.on( Events.ADD_PRODUCTS, this.addProducts.bind(this) )

		this.dispatch.on( Events.GET_CATEGORIES, this.getCategories.bind(this) )
		this.dispatch.on( Events.DELETE_CATEGORIES, this.deleteCategories.bind(this) )
		this.dispatch.on( Events.UPDATE_CATEGORIES, this.updateCategories.bind(this) )
		this.dispatch.on( Events.ADD_CATEGORIES, this.addCategories.bind(this) )

		this.dispatch.on( Events.GET_IMAGES, this.getImages.bind(this) )
		this.dispatch.on( Events.ADD_IMAGES, this.addImages.bind(this) )
		this.dispatch.on( Events.GET_IMAGES_PRODUCTS, this.getImages.bind(this) )
		this.dispatch.on( Events.ADD_IMAGES_PRODUCTS, this.addImagesProducts.bind(this) )
		this.dispatch.on( Events.DELETE_IMAGES, this.deleteImages.bind(this) )

		this.dispatch.on( Events.GET_TODOS, this.getTodos.bind(this) )
		this.dispatch.on( Events.ADD_TODOS, this.addTodos.bind(this) )
		this.dispatch.on( Events.DELETE_TODOS, this.deleteTodos.bind(this) )
	}

	preloadJSON( dataURL) {
		$.ajax({ url: dataURL, success: this.jsonLoaded, context: this })
	}

	jsonLoaded( data ) {
		this.attributes.data = data
		this.dispatch.trigger( Events.JSON_LOADED )
	}

	setCookie(name, value, days) {
		document.cookie = name+'='+value+'; max-age='+60*60*24*days+'; path=/'
	}

	getCookie( cookie_name ) {
	  let cookie_string = document.cookie 
	  if (cookie_string.length != 0) {
	  	let re = new RegExp('(^|;)[\\s]*'+cookie_name+'=([^;]*)')
	    let cookie_value = cookie_string.match( re )
	    if (cookie_value != undefined) {
	    	return decodeURIComponent( cookie_value[2] )
	    } else {
	    	return ''
	    }
	  }
	  return ''
	}

	deleteCookie( cookie_name ) {
	  document.cookie = cookie_name+'=; max-age=0; path=/'
	}

	request(type, params, file, onSuccessCallback, onErrorCallback){
		let self = this
		let data  = {"type" : type, "params" : params, "session_id" : this.attributes.sessionId}
		let jData = JSON.stringify(data)
		let cType = false
		let dType = false
		let formData = new FormData()

		if(typeof(file) !== "undefined" && file.length !== 0) {
			if(file !== undefined){
				if (file.length > 1) {
					for(var i = 0; i < file.length; i++) { 
						formData.append('file-'+i, file[i]) 
					}
				} else if (file.length == 1) {
					formData.append('file-0', file[0])
				} else {
					formData.append('file', file)
				}
			}
			formData.append('data', jData)		
			cType = false
			dType = false
		} else {
			formData = jData
		}



		try{
			$.ajax({
				type        : 'POST',
				url         : this.API_URL+"app.php",
				timeout     : 30000,
				contentType : false,
				dataType    : false,
				cache       : false,
				processData : false,
				data        : formData,
				success : function(result) {
					if(result.session_id){
						self.attributes.sessionId = result.session_id;
					}
					if(result.error == null){
						onSuccessCallback(type, params, result);
					} else {
						onErrorCallback(type, params, result);
					}
				},
				error : function(jqXHR, textStatus, errorThrown){
					console.log("error: ", textStatus)
					if(textStatus !== "parsererror"){
						setTimeout(function(){ self.request(type, params, file, onSuccessCallback, onErrorCallback) }, 5000)
					}
				}
			})
		} catch(err) {
			console.log("error: ", err)  
		}
	}		

	callback(type, params, result){
		console.log(JSON.stringify(result, null, '\t'))
		console.log(JSON.stringify(params, null, '\t'))
	}

	publish() {
		let params = {}
		this.request('publish', params, undefined, this.publishSuccess.bind(this), this.failed.bind(this))
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'info', "Saving...")
	}

	moveUp(params) {
		this.request('moveUp', params, undefined, this.moveSuccess.bind(this), this.failed.bind(this))
	}

	moveDown(params) {
		this.request('moveDown', params, undefined, this.moveSuccess.bind(this), this.failed.bind(this))
	}

	moveSuccess(type, params) {
		if (params.table == 'gallery') {
			this.getGallery()
		} else if (params.table == 'slider') {
			this.getSlider()
		}
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', "Order changed")
	}

	publishSuccess() {
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', "Changed successfully saved")
	}

	checkLogin(){
		let params = {}
		this.request('checkLogin', params, undefined, this.loginSuccess.bind(this), this.failed.bind(this))
	}

	login(params){
		this.request('login', params || {}, undefined, this.loginSuccess.bind(this), this.loginFailed.bind(this))
	}

	loginSuccess(type, params, result) {
		if (result.logged === true) {
			this.attributes.error = result.error
			this.attributes.userLogged = true
			this.userData()
		}
	}

	logout(){
		let params = {}
		this.request('logout', params, undefined, this.logoutSuccess.bind(this), this.failed.bind(this))
	}

	logoutSuccess() {
		this.attributes.userLogged = false
		this.dispatch.trigger( Events.MODEL_CHANGED )
	}

	userData(){
		let params = {}
		this.request('userData', params, undefined, this.userDataSuccess.bind(this), this.failed.bind(this))
	}

	userDataSuccess(type, params, result) {
		this.attributes.error = result.error
		this.attributes.userLogged = result.logged
		this.attributes.userData = result.result
		this.dispatch.trigger( Events.MODEL_CHANGED )
	}

	failed(type, params, result) {
		if(result.logged === false) {
			this.attributes.userLogged = false
			this.attributes.error = result.error
			this.dispatch.trigger( Events.CHANGE_ROUTE, 'login' )
		} else {
			this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'error', result.error)
		}
	}

	loginFailed(type, params, result) {
		this.attributes.error = result.error
		this.dispatch.trigger( Events.MODEL_CHANGED )
	}

	updateUserData(params){
		this.request('updateUserData', params, undefined, this.updateUserDataSuccess.bind(this), this.loginFailed.bind(this))
	}

	updateUserDataSuccess() {
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', "User data successfully changed")
		this.userData()
	}

	updateUserPassword(params){
		this.request('updateUserPassword', params, undefined, this.updateUserPasswordSuccess.bind(this), this.updateUserPasswordFailed.bind(this))
	}

	updateUserPasswordSuccess() {
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', "User password successfully changed")
	}

	updateUserPasswordFailed(type, params, result) {
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'error', result.error)
	}

	// gallery

	getGallery() {
		let params = {}
		this.request('getGallery', params, undefined, this.getGallerySuccess.bind(this), this.getGalleryFailed.bind(this))
	}

	getGallerySuccess(type, params, result) {
		this.attributes.gallery = result.result
		this.dispatch.trigger( Events.MODEL_CHANGED )
	}

	getGalleryFailed(type, params, result) {
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'error', result.error)
	}

	deleteGallery(id) {
		let params = { "id": id, "table": "gallery" }
		this.request('delete', params, undefined, this.deleteGallerySuccess.bind(this), this.failed.bind(this))
	}

	deleteGallerySuccess() {
		this.getGallery()
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', "Successfully removed")
		this.dispatch.trigger( Events.UPDATE_SUCCESS )
	}

	updateGallery(params, file) {
		this.request('updateGallery', params, file, this.updateGallerySuccess.bind(this), this.failed.bind(this))
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'info', "Saving...")
	}

	updateGallerySuccess() {
		this.getGallery()
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', "Successfully updated")
		this.dispatch.trigger( Events.UPDATE_SUCCESS )
	}

	addGallery(params, file) {
		this.request('addGallery', params, file, this.addGallerySuccess.bind(this), this.failed.bind(this))
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'info', "Saving...")
	}

	addGallerySuccess() {
		this.getGallery()
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', "Successfully added")
		this.dispatch.trigger( Events.UPDATE_SUCCESS )
	}

	// categories

	getCategories() {
		let params = {}
		this.request('getCategories', params, undefined, this.getCategoriesSuccess.bind(this), this.getCategoriesFailed.bind(this))
	}

	getCategoriesSuccess(type, params, result) {
		this.attributes.categories = result.result
		this.dispatch.trigger( Events.MODEL_CHANGED )
	}

	getCategoriesFailed(type, params, result) {
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'error', result.error)
	}

	deleteCategories(id) {
		let params = { "id": id, "table": "categories" }
		this.request('delete', params, undefined, this.deleteCategoriesSuccess.bind(this), this.failed.bind(this))
	}

	deleteCategoriesSuccess() {
		this.getCategories()
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', "Successfully removed")
		this.dispatch.trigger( Events.UPDATE_SUCCESS )
	}

	updateCategories(params, file) {
		this.request('updateCategories', params, file, this.updateCategoriesSuccess.bind(this), this.failed.bind(this))
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'info', "Saving...")
	}

	updateCategoriesSuccess() {
		this.getCategories()
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', "Successfully updated")
		this.dispatch.trigger( Events.UPDATE_SUCCESS )
	}

	addCategories(params, file) {
		this.request('addCategories', params, file, this.addCategoriesSuccess.bind(this), this.failed.bind(this))
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'info', "Saving...")
	}

	addCategoriesSuccess() {
		this.getCategories()
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', "Successfully added")
		this.dispatch.trigger( Events.UPDATE_SUCCESS )
	}

	// products

	getProducts() {
		let params = {}
		this.request('getProducts', params, undefined, this.getProductsSuccess.bind(this), this.getProductsFailed.bind(this))
	}

	getProductsSuccess(type, params, result) {
		this.attributes.products = result.result
		this.dispatch.trigger( Events.MODEL_CHANGED )
	}

	getProductsFailed(type, params, result) {
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'error', result.error)
	}

	deleteProducts(id) {
		let params = { "id": id, "table": "products" }
		this.request('delete', params, undefined, this.deleteProductsSuccess.bind(this), this.failed.bind(this))
	}

	deleteProductsSuccess() {
		this.getProducts()
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', "Successfully removed")
		this.dispatch.trigger( Events.UPDATE_SUCCESS )
	}

	updateProducts(params, file) {
		this.request('updateProducts', params, file, this.updateProductsSuccess.bind(this), this.failed.bind(this))
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'info', "Saving...")
	}

	updateProductsSuccess() {
		this.getProducts()
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', "Successfully updated")
		this.dispatch.trigger( Events.UPDATE_SUCCESS )
	}

	addProducts(params, file) {
		this.request('addProducts', params, file, this.addProductsSuccess.bind(this), this.failed.bind(this))
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'info', "Saving...")
	}

	addProductsSuccess() {
		this.getProducts()
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', "Successfully added")
		this.dispatch.trigger( Events.UPDATE_SUCCESS )
	}

	// images

	getImages() {
		let params = {}
		this.request('getImages', params, undefined, this.getImagesSuccess.bind(this), this.failed.bind(this))
	}

	getImagesSuccess(type, params, result) {
		this.attributes.images = result.result
		this.dispatch.trigger( Events.MODEL_CHANGED )
	}

	addImages(id, files) {
		let params = { id: id }
		this.request('addImages', params, files, this.addImagesSuccess.bind(this), this.failed.bind(this))
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'info', "Saving...")
	}

	addImagesProducts(id, files) {
		let params = { id: id }
		this.request('addImagesProducts', params, files, this.addImagesSuccess.bind(this), this.failed.bind(this))
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'info', "Saving...")
	}

	addImagesSuccess() {
		this.getImages()
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', "Successfully added")
		this.dispatch.trigger( Events.UPDATE_SUCCESS )
	}

	deleteImages(id) {
		let params = { "id": id, "table": "images" }
		this.request('delete', params, undefined, this.deleteImagesSuccess.bind(this), this.failed.bind(this))
	}

	deleteImagesSuccess() {
		this.getImages()
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', "Successfully removed")
		this.dispatch.trigger( Events.UPDATE_SUCCESS )
	}

	// todos

	getTodos() {
		let params = {}
		this.request('getTodos', params, undefined, this.getTodosSuccess.bind(this), this.failed.bind(this))
	}

	getTodosSuccess(type, params, result) {
		this.attributes.todos = result.result
		this.dispatch.trigger( Events.MODEL_CHANGED )
	}

	deleteTodos(id) {
		let params = { "id": id, "table": "todos" }
		this.request('delete', params, undefined, this.deleteTodosSuccess.bind(this), this.failed.bind(this))
	}

	deleteTodosSuccess() {
		this.getTodos()
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', "Successfully removed")
		this.dispatch.trigger( Events.UPDATE_SUCCESS )
	}

	addTodos(params) {
		this.request('addTodos', params, undefined, this.addTodosSuccess.bind(this), this.failed.bind(this))
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'info', "Saving...")
	}

	addTodosSuccess() {
		this.getTodos()
		this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'success', "Successfully added")
		this.dispatch.trigger( Events.UPDATE_SUCCESS )
	}


	defaults() {
		return {
			route: "/",
			userLogged: false,
			userData: {},
			sessionId: null,
			error: null,
			gallery: null,
			products: null,
			categories: null,
			offer: null,
			images: null,
			todos: null
		}
	}
}