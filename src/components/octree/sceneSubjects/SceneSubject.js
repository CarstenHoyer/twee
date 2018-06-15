import * as THREE from 'three'
import Octree from './Octree'
import { Noise } from 'noisejs'

export default class SceneSubject {
  constructor (scene) {
    this.scene = scene
    this.boundary = {
      x: 0,
      y: 0,
      z: 0,
      w: 1000,
      h: 1000,
      d: 1000
    }
    this.spheres = []
    this.noise = new Noise(Math.random())
    this.tx = 0
    this.ty = 500
    this.tz = 1000
    this.init()
  }

  rand (arr) {
    return arr.map(a => (Math.random() * 2 - 1) * a)
  }

  init () {
    for (let _ in [...Array(100).keys()]) {
      const geometry = new THREE.SphereBufferGeometry(20, 32, 32)
      const material = new THREE.MeshBasicMaterial({color: 0xffff00})
      const sphere = new THREE.Mesh(geometry, material)
      this.scene.add(sphere)
      this.spheres.push(sphere)
      sphere.position.set(...this.rand([this.boundary.w / 2, this.boundary.h / 2, this.boundary.d / 2]))
    }
  }

  getUpdatedPositions (pos) {
    const { x, y, z, w, h, d } = this.boundary
    const newPos = [
      pos[0] + this.noise.perlin2(pos[0], this.tx) * 50,
      pos[1] + this.noise.perlin2(pos[1], this.ty) * 50,
      pos[2] + this.noise.perlin2(pos[2], this.tz) * 50
    ]
    this.tx += 0.9
    this.ty += 0.9
    this.tz += 0.9

    if (newPos[0] > x + w / 2 || newPos[0] < x - w / 2) {
      newPos[0] = pos[0]
    }

    if (newPos[1] > y + h / 2 || newPos[1] < y - h / 2) {
      newPos[1] = pos[1]
    }

    if (newPos[2] > z + d / 2 || newPos[2] < z - d / 2) {
      newPos[2] = pos[2]
    }

    return newPos
  }

  update (time) {
    this.octree = new Octree(this.boundary, this.scene, true)
    this.spheres.forEach(sphere => {
      let pos = sphere.position.toArray()
      const [x, y, z] = this.getUpdatedPositions(pos)
      sphere.position.set(x, y, z)
      this.octree.insert(sphere.position.toArray())
    })
    this.octree.render()
  }
}
