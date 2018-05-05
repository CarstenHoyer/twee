import * as THREE from 'three'

export default class SceneSubject {
  constructor (scene) {
    this.MAX_POINTS = 5000
    this.scene = scene
    this.init()
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

    this.updatePositions()
  }

  updatePositions () {
    const positions = this.line.geometry.attributes.position.array
    let x, y, index
    x = y = index = 0

    for (let i = 0, l = this.MAX_POINTS; i < l; i++) {
      positions[ index++ ] = x
      positions[ index++ ] = y
      index++
      x += (Math.random() - 0.5) * 50
      y += (Math.random() - 0.5) * 50
    }
  }
}
