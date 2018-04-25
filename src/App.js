import React, { Component } from 'react'
import logo from './logo.svg'
import threeEntryPoint from './threejs/threeEntryPoint'
import './App.css'

class App extends Component {
  componentDidMount () {
    threeEntryPoint(this.threeRootElement)
  }

  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to React</h1>
        </header>
        <p className='App-intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div ref={(element) => { this.threeRootElement = element }} />
      </div>
    )
  }
}

export default App
