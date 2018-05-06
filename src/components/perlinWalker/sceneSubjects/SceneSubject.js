import { Noise } from 'noisejs'
import * as THREE from 'three'
import dat from 'dat.gui'

export default class SceneSubject {
  constructor (scene, width, height) {
    this.width = width
    this.height = height
    this.MAX_POINTS = 500
    this.scene = scene
    this.noise = new Noise(Math.random())
    this.tx = 0
    this.ty = 10000
    this.smoothness = 30
    this.gui = new dat.GUI()
    this.gui.add(this, 'smoothness', 1, 100)
    this.init()
  }

  destroy () {
    this.gui.destroy()
  }

  init () {
    this.drawCount = 2
    const positions = new Float32Array(this.MAX_POINTS * 3)

    const geometry = new THREE.BufferGeometry()
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setDrawRange(0, this.drawCount)

    const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 20 })

    this.line = new THREE.Line(geometry, material)
    this.scene.add(this.line)
    this.updatePositions()
  }

  update (time) {
    this.drawCount = (this.drawCount + 1) % this.MAX_POINTS
    this.line.geometry.setDrawRange(0, this.drawCount)
    if (this.drawCount > 0) return
    this.line.geometry.attributes.position.needsUpdate = true
    this.line.material.color.setHSL(Math.random(), 1, 0.5)
    this.updatePositions()
  }

  map (x, fromMin, fromMax, toMin, toMax) {
    const fromRange = Math.abs(fromMax - fromMin)
    const toRange = Math.abs(toMax - toMin)
    const fromX = fromRange * x
    const ratio = toRange / fromRange
    return fromX * ratio
  }

  updatePositions () {
    const positions = this.line.geometry.attributes.position.array
    let x, y
    x = y = Math.random()
    let index = 0
    for (let i = 0, l = this.MAX_POINTS; i < l; i++) {
      positions[ index++ ] = x
      positions[ index++ ] = y
      positions[ index++ ] = 0
      // x = this.width / 2
      // y = 0
      x += this.map(this.noise.perlin2(x / this.smoothness, this.tx), -1, 1, -1 * this.width / 2, this.width / 2) * 0.1
      y += this.map(this.noise.perlin2(y / this.smoothness, this.ty), -1, 1, -1 * this.height / 2, this.height / 2) * 0.1
      this.tx += 0.1
      this.ty += 0.1
    }
  }
}
