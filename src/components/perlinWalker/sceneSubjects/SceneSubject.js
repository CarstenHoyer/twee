import { Noise } from 'noisejs'
import * as THREE from 'three'
import dat from 'dat.gui'

export default class SceneSubject {
  constructor (scene, width, height) {
    this.scene = scene
    this.width = width
    this.height = height
    this.MAX_POINTS = 500
    this.noise = new Noise(Math.random())
    this.tx = 0
    this.ty = 10000
    this.smoothness = 70
    this.gui = new dat.GUI()
    this.gui.add(this, 'smoothness', 1, 300)
    this.init()
  }

  destroy () {
    this.gui.destroy()
  }

  init () {
    this.drawCount = 2
    const positions = new Float32Array(this.MAX_POINTS * 3)
    const colors = new Float32Array(this.MAX_POINTS * 3)

    const geometry = new THREE.BufferGeometry()
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setDrawRange(0, this.drawCount)

    const material = new THREE.LineBasicMaterial({ color: 0xffffff, lineWidth: 100, vertexColors: THREE.VertexColors })

    this.line = new THREE.LineSegments(geometry, material)
    this.scene.add(this.line)
    this.calculateBorders()
    this.updatePositions()
  }

  calculateBorders () {
    this.right = this.width / 2
    this.left = -1 * this.right
    this.top = this.height / 2
    this.bottom = -1 * this.top
  }

  onWindowResize (width, height) {
    this.width = width
    this.height = height
    this.calculateBorders()
    this.drawCount = this.MAX_POINTS - 1
  }

  update (time) {
    this.drawCount = (this.drawCount + 1) % this.MAX_POINTS
    this.line.geometry.setDrawRange(0, this.drawCount)
    if (this.drawCount > 0) return
    this.line.geometry.attributes.position.needsUpdate = true
    this.line.geometry.attributes.color.needsUpdate = true
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
    const colors = this.line.geometry.attributes.color.array
    let x, y
    x = y = 0
    let index = 0
    for (let i = 0, l = this.MAX_POINTS; i < l; i++, index += 6) {
      let newX = x + this.map(this.noise.perlin2(x / this.smoothness, this.tx), -1, 1, -1 * this.width / 2, this.width / 2) * 0.1
      let newY = y + this.map(this.noise.perlin2(y / this.smoothness, this.ty), -1, 1, -1 * this.height / 2, this.height / 2) * 0.1

      this.tx += 0.1
      this.ty += 0.1

      // Start
      positions[ index ] = x
      positions[ index + 1 ] = y

      // End
      positions[ index + 3 ] = newX
      positions[ index + 4 ] = newY

      // Start Color
      colors[index] = Math.random()
      colors[index + 1] = Math.random()
      colors[index + 2] = Math.random()

      // End color
      colors[index + 3] = Math.random()
      colors[index + 4] = Math.random()
      colors[index + 5] = Math.random()

      x = x > this.right ? this.left : x < this.left ? this.right : newX
      y = y > this.top ? this.bottom : y < this.bottom ? this.top : newY
    }
  }
}
