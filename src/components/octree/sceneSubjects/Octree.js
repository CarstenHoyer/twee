import * as THREE from 'three'

export default class Octree {
  constructor (boundary, scene, isRoot = false) {
    this.scene = scene
    this.boundary = boundary
    this.isRoot = isRoot
    this.pos = {
      x1: boundary.x - boundary.w / 2,
      x2: boundary.x + boundary.w / 2,
      y1: boundary.y - boundary.h / 2,
      y2: boundary.y + boundary.h / 2,
      z1: boundary.z - boundary.d / 2,
      z2: boundary.z + boundary.d / 2
    }
    this.points = []
    this.size = 1
    this.init()
  }

  init () {
    const { x1, x2, y1, y2, z1, z2 } = this.pos
    const geometry = new THREE.Geometry()

    // Front
    geometry.vertices.push(new THREE.Vector3(x1, y1, z1))
    geometry.vertices.push(new THREE.Vector3(x1, y2, z1))

    geometry.vertices.push(new THREE.Vector3(x1, y2, z1))
    geometry.vertices.push(new THREE.Vector3(x2, y2, z1))

    geometry.vertices.push(new THREE.Vector3(x2, y2, z1))
    geometry.vertices.push(new THREE.Vector3(x2, y1, z1))
  
    geometry.vertices.push(new THREE.Vector3(x2, y1, z1))
    geometry.vertices.push(new THREE.Vector3(x1, y1, z1))

    // Right side
    geometry.vertices.push(new THREE.Vector3(x1, y1, z1))
    geometry.vertices.push(new THREE.Vector3(x1, y1, z2))

    geometry.vertices.push(new THREE.Vector3(x1, y1, z2))
    geometry.vertices.push(new THREE.Vector3(x1, y2, z2))

    geometry.vertices.push(new THREE.Vector3(x1, y2, z2))
    geometry.vertices.push(new THREE.Vector3(x1, y2, z1))

    // Left side
    geometry.vertices.push(new THREE.Vector3(x2, y1, z1))
    geometry.vertices.push(new THREE.Vector3(x2, y1, z2))

    geometry.vertices.push(new THREE.Vector3(x2, y1, z2))
    geometry.vertices.push(new THREE.Vector3(x2, y2, z2))

    geometry.vertices.push(new THREE.Vector3(x2, y2, z2))
    geometry.vertices.push(new THREE.Vector3(x2, y2, z1))

    // Back
    geometry.vertices.push(new THREE.Vector3(x1, y2, z2))
    geometry.vertices.push(new THREE.Vector3(x2, y2, z2))

    geometry.vertices.push(new THREE.Vector3(x2, y1, z2))
    geometry.vertices.push(new THREE.Vector3(x1, y1, z2))

    const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 })
    this.line = new THREE.LineSegments(geometry, material)
  }

  boundaryContains (point) {
    const { x1, x2, y1, y2, z1, z2 } = this.pos
    return (
      point[0] > x1 && point[0] < x2 &&
      point[1] > y1 && point[1] < y2 &&
      point[2] > z1 && point[2] < z2
    )
  }

  insert (point) {
    if (!this.boundaryContains(point)) return false

    if (this.points.length < this.size) {
      this.points.push(point)
      return true
    }

    if (!this.children) {
      let { x, y, z, w, h, d } = this.boundary
      w = w / 4
      h = h / 4
      d = d / 4
      const pos = [
        { x: x - w, y: y - h, z: z - d, w: w * 2, h: h * 2, d: d * 2 },
        { x: x - w, y: y - h, z: z + d, w: w * 2, h: h * 2, d: d * 2 },
        { x: x - w, y: y + h, z: z - d, w: w * 2, h: h * 2, d: d * 2 },
        { x: x - w, y: y + h, z: z + d, w: w * 2, h: h * 2, d: d * 2 },
        { x: x + w, y: y + h, z: z - d, w: w * 2, h: h * 2, d: d * 2 },
        { x: x + w, y: y + h, z: z + d, w: w * 2, h: h * 2, d: d * 2 },
        { x: x + w, y: y - h, z: z - d, w: w * 2, h: h * 2, d: d * 2 },
        { x: x + w, y: y - h, z: z + d, w: w * 2, h: h * 2, d: d * 2 }
      ]
      this.children = pos.map(p => new Octree(p, this.scene))
    }

    this.children.forEach(child => child.insert(point))

    return false
  }

  render () {
    // if (!this.points.length && !this.isRoot) return false
    console.log(this.points.length)
    this.scene.add(this.line)
    this.children && this.children.forEach(c => c.render())
    // this.line.material.color.setHSL(Math.random(), 1, 0.5)
    // this.line.rotation.y = -Math.PI * .65
    // this.line.rotation.z = -Math.PI * 1.15;
  }
}
