import { Noise } from 'noisejs'
import * as THREE from 'three'
import dat from 'dat.gui'

export default class SceneSubject {
  constructor (scene) {
    this.MAX_POINTS = 500
    this.scene = scene
    this.noise = new Noise(Math.random())
    this.tx = 0
    this.ty = 10000
    this.smoothness = 1000
    this.gui = new dat.GUI()
    this.gui.add(this, 'smoothness', 1, 1000)
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

    const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 })

    this.line = new THREE.Line(geometry, material)
    this.scene.add(this.line)
    this.updatePositions()
    this.line.geometry.attributes.position.needsUpdate = true
    this.line.material.color.setHSL(Math.random(), 1, 0.5)
  }

  update (time) {
    this.drawCount = (this.drawCount + 1) % this.MAX_POINTS
    this.line.geometry.setDrawRange(0, this.drawCount)
    if (this.drawCount > 0) return
    this.line.geometry.attributes.position.needsUpdate = true
    this.line.material.color.setHSL(Math.random(), 1, 0.5)
    this.updatePositions()
  }

  map (n, start1, stop1, start2, stop2) {
    return n * stop2
  }

  updatePositions () {
    const positions = this.line.geometry.attributes.position.array
    let x, y
    x = y = Math.random()
    let index = 0
    const [width, height] = [1179, 555]
    for (let i = 0, l = this.MAX_POINTS; i < l; i++) {
      positions[ index++ ] = x
      positions[ index++ ] = y
      index++
      x = this.map(this.noise.perlin2(x / this.smoothness, this.tx), -1, 1, 0, width)
      y = this.map(this.noise.perlin2(y / this.smoothness, this.ty), -1, 1, 0, height)
      this.tx += 0.01
      this.ty += 0.01
    }
  }
}
