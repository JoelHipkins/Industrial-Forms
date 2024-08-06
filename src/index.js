import 'react-app-polyfill/ie9'
import 'filepond-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import MainView from './app/MainView'

export default class Main {

	preloadJSON( dataURL) {
		fetch(dataURL)
			.then((response) => {
			    return response.json()
			})
			.then((result) => {
			    this.data = result
			    this.getData()
			})
	}

	getData() {
		let myHeaders = new Headers()
		myHeaders.append('pragma', 'no-cache')
		myHeaders.append('cache-control', 'no-cache')

		fetch("/api/upload/data.json", {
				headers: myHeaders
			})
			.then((response) => {
			    return response.json()
			})
			.then((result) => {
			    this.data.categories = result.categories
			    this.ready()
			})
		fetch("/api/upload/data.json", {
				headers: myHeaders
			})
			.then((response) => {
			    return response.json()
			})
			.then((result) => {
			    this.data.portfolio = result.portfolio
			    this.ready()
			})
		fetch("/api/upload/data.json", {
				headers: myHeaders
			})
			.then((response) => {
			    return response.json()
			})
			.then((result) => {
			    this.data.products = result.products
			    this.ready()
			})
	}

	init() {
		this.preloadJSON("/data/data.json")
	}

	ready() {
		if (this.data.portfolio && this.data.categories && this.data.products) {
			this.render()
		}
	}

	render() {
		const mainContainer = document.getElementById('app')

		ReactDOM.render(
			<Router>
				<MainView 
					data={ this.data }/>
			</Router>
		, mainContainer)
	}
}

const app = new Main()
app.init()