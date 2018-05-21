import React, { Component } from 'react'
import ThreeEntryPoint from '../components/simpleFractals/ThreeEntryPoint'

class SimpleFractals extends Component {
  componentDidMount () {
    this.entryPoint = new ThreeEntryPoint(this.threeRootElement)
  }

  componentWillUnmount () {
    this.entryPoint.destroy(this.threeRootElement)
  }

  render () {
    return (
      <div className='root-element' ref={(e) => { this.threeRootElement = e }} />
    )
  }
}

export default SimpleFractals
