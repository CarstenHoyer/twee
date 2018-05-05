import React, { Component } from 'react'
import ThreeEntryPoint from '../components/randomWalker/ThreeEntryPoint'

class RandomWalker extends Component {
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

export default RandomWalker
