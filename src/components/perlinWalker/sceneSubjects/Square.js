import * as THREE from 'three'

export default class SceneSubject {
  constructor (scene, width, height) {
    this.scene = scene
    this.width = width
    this.height = height
    this.cube = this.init()
  }

  init () {
    var geometry = new THREE.BoxGeometry(this.width, this.height, 0)
    var material = new THREE.MeshBasicMaterial({color: 0xFF0000})
    var cube = new THREE.Mesh(geometry, material)
    this.scene.add(cube)
    cube.position.set(0, 0, 0)
    return cube
  }

  onWindowResize (width, height) {
    this.width = width
    this.height = height
    this.cube.position.set(this.width, this.height, 0)
  }

  update (time) {
    // Empty
  }

  map (x, fromMin, fromMax, toMin, toMax) {
    const fromRange = Math.abs(fromMax - fromMin)
    const toRange = Math.abs(toMax - toMin)
    const fromX = fromRange * x
    const ratio = toRange / fromRange
    return fromX * ratio
  }
}
