import * as THREE from 'three'

export default class SceneSubject {
  constructor (scene) {
    this.scene = scene
    this.init()
  }

  _addEllipse (x, y, radius) {
    const curve = new THREE.EllipseCurve(
      x, y,
      radius, radius
    )

    const points = curve.getPoints(50)
    const colors = new Float32Array(points.length * 3)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors })

    const colorsArray = geometry.attributes.color.array
    for (let i = 0; i < colorsArray.length; i++) {
      colorsArray[i] = Math.random()
    }
    geometry.attributes.color.needsUpdate = true

    // Create the final object to add to the scene
    const ellipse = new THREE.Line(geometry, material)
    this.scene.add(ellipse)
  }

  _addEllipses (x, y, radius) {
    this._addEllipse(x, y, radius)
    if (radius > 2) {
      this._addEllipses(x + radius, y, radius / 2)
      this._addEllipses(x - radius, y, radius / 2)
      // this._addEllipses(x, y + radius, radius / 1.8)
      this._addEllipses(x, y - radius, radius / 2)
    }
  }

  init () {
    this._addEllipses(0, 0, 500)
    // this._addEllipses(10, 0, 500)
  }

  update (time) {

  }

  updatePositions () {

  }
}
