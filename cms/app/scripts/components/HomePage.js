import React from 'react'
import BaseComponent from './BaseComponent'
import $ from 'jquery'
import Events from '../events/events.js'

export default class extends BaseComponent {

  constructor(props) {

    super(props)
    this._bind('leadingZero', 'showTextTime', 'addTodo', 'deleteTodo', 'handleInputChange')
    this.state = { date: null, time: null, todo: "" }
    this.dispatch = this.props.dispatch
    this.dispatch.trigger( Events.GET_TODOS )
  }

  componentDidMount() {
    this.showTextTime()
    this.interval = setInterval(this.showTextTime, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  leadingZero(i) {
    return (i < 10)? '0'+i : i
  }

  showTextTime() {
    let currentDate = new Date()
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let textDate = days[currentDate.getDay()] + ', ' + this.leadingZero(currentDate.getDate()) + "." + this.leadingZero((currentDate.getMonth()+1)) + "." + currentDate.getFullYear()
    let textTime = this.leadingZero(currentDate.getHours()) + ":" + this.leadingZero(currentDate.getMinutes())

    this.setState({ date: textDate, time: textTime })
  }

  addTodo() {
    if (this.state.todo != "") {
      this.dispatch.trigger( Events.ADD_TODOS, { description: this.state.todo } )
      this.setState({ todo: "" })
    }
    this.dispatch.trigger( Events.SHOW_NOTIFICATION, 'error', 'This input should be filled' )
  }

  deleteTodo(id) {
    this.dispatch.trigger( Events.DELETE_TODOS, id )
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  render() {
    let todos = []
    if (this.props.todos !== null) {
      for (var i = 0; i < this.props.todos.length; i++) {
        let item = (
          <li key={ i }>
            <span className="todo-id">#{ i+1 }</span>
            <span className="todo-text">{ this.props.todos[i].description }</span>
            <div className="remove" onClick={ this.deleteTodo.bind(null, this.props.todos[i].id) }></div>
          </li>
        )
        todos.push(item)
      }
    }

    return (
      <section className="home">
        <div className="welcome">Hello,<br/><span>{ this.props.userData.fullname }</span></div>
        <div className="date">
          <div className="today">{ this.state.date }</div>
          <div className="time">{ this.state.time }</div>
        </div>
        <div className="todos">
          <h2>To do's:</h2>
          <ul>
            { todos }
            <li className="input"><input type="text" name="todo" placeholder="Write 'to do' here" value={this.state.todo} onChange={ this.handleInputChange } required/><div className="add" onClick={ this.addTodo }></div></li>
          </ul>
        </div>
      </section>
    )
  }
}
