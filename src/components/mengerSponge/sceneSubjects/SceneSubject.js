import * as THREE from 'three'

export default class SceneSubject {
  constructor (scene) {
    this.scene = scene
    this.yRotation = 0
    this.xRotation = 0
    this.init()
  }

  tile (size, pos) {
    let half = size / 2
    return [
      new THREE.Vector3(-1 * half, half, 0),
      new THREE.Vector3(-1 * half, -1 * half, 0),
      new THREE.Vector3(half, -1 * half, 0),

      new THREE.Vector3(-1 * half, half, 0),
      new THREE.Vector3(half, -1 * half, 0),
      new THREE.Vector3(half, half, 0)
    ]
  }

  cube (size, pos) {
    const values = [-1 * size / 2, size / 2]
    const vertices = []
    for (let z = 0; z <= 1; z++) {
      for (let y = 0; y <= 1; y++) {
        for (let x = 0; x <= 1; x++) {
          vertices.push(new THREE.Vector3(values[x] + pos[0], values[y] + pos[1], values[z] + pos[2]))
        }
      }
    }

    vertices.forEach(vertex => this.geom.vertices.push(vertex))

    const l = Math.floor(this.geom.faces.length / 12) * 8
    // Front
    this.geom.faces.push(new THREE.Face3(l + 0, l + 1, l + 2))
    this.geom.faces.push(new THREE.Face3(l + 1, l + 2, l + 3))
    // Back
    this.geom.faces.push(new THREE.Face3(l + 4, l + 5, l + 6))
    this.geom.faces.push(new THREE.Face3(l + 5, l + 6, l + 7))
    // Top
    this.geom.faces.push(new THREE.Face3(l + 6, l + 7, l + 2))
    this.geom.faces.push(new THREE.Face3(l + 7, l + 2, l + 3))
    // right
    this.geom.faces.push(new THREE.Face3(l + 3, l + 5, l + 1))
    this.geom.faces.push(new THREE.Face3(l + 3, l + 5, l + 7))
    // left
    this.geom.faces.push(new THREE.Face3(l + 4, l + 6, l + 2))
    this.geom.faces.push(new THREE.Face3(l + 0, l + 4, l + 2))
    // Bottom
    this.geom.faces.push(new THREE.Face3(l + 4, l + 0, l + 1))
    this.geom.faces.push(new THREE.Face3(l + 1, l + 5, l + 4))
  }

  sponge (size, pos) {
    const cubeSize = size / 3
    let [x, y, z] = pos
    let fn = cubeSize > 10 ? this.sponge.bind(this) : this.cube.bind(this)
    // fn(cubeSize, [x, y, z])
    // fn(cubeSize, [x, y + cubeSize, z])
    // fn(cubeSize, [x, y - cubeSize, z])
    // fn(cubeSize, [x + cubeSize, y, z])
    fn(cubeSize, [x + cubeSize, y + cubeSize, z])
    fn(cubeSize, [x + cubeSize, y - cubeSize, z])
    //  fn(cubeSize, [x - cubeSize, y, z])
    fn(cubeSize, [x - cubeSize, y + cubeSize, z])
    fn(cubeSize, [x - cubeSize, y - cubeSize, z])

    // fn(cubeSize, [x, y, z + cubeSize])
    fn(cubeSize, [x, y + cubeSize, z + cubeSize])
    fn(cubeSize, [x, y - cubeSize, z + cubeSize])
    fn(cubeSize, [x + cubeSize, y, z + cubeSize])
    fn(cubeSize, [x + cubeSize, y + cubeSize, z + cubeSize])
    fn(cubeSize, [x + cubeSize, y - cubeSize, z + cubeSize])
    fn(cubeSize, [x - cubeSize, y, z + cubeSize])
    fn(cubeSize, [x - cubeSize, y + cubeSize, z + cubeSize])
    fn(cubeSize, [x - cubeSize, y - cubeSize, z + cubeSize])

    // fn(cubeSize, [x, y, z - cubeSize])
    fn(cubeSize, [x, y + cubeSize, z - cubeSize])
    fn(cubeSize, [x, y - cubeSize, z - cubeSize])
    fn(cubeSize, [x + cubeSize, y, z - cubeSize])
    fn(cubeSize, [x + cubeSize, y + cubeSize, z - cubeSize])
    fn(cubeSize, [x + cubeSize, y - cubeSize, z - cubeSize])
    fn(cubeSize, [x - cubeSize, y, z - cubeSize])
    fn(cubeSize, [x - cubeSize, y + cubeSize, z - cubeSize])
    fn(cubeSize, [x - cubeSize, y - cubeSize, z - cubeSize])
  }

  init () {
    this.geom = new THREE.Geometry()
    this.sponge(600, [0, 0, 0])
    this.geom.computeFaceNormals()

    this.object = new THREE.Mesh(this.geom, new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }))

    // object.position.z = -100;//move a bit back - size of 500 is a bit big
    // object.rotation.y = -Math.PI * .75
    // object.rotation.z = -Math.PI * 1.25;

    this.scene.add(this.object)
  }

  update (time) {
    // this.object.geometry.attributes.rotation.needsUpdate = true
    // this.line.geometry.attributes.color.needsUpdate = true
    this.updatePositions()
  }

  updatePositions () {
    this.yRotation += 0.0005
    this.xRotation += 0.00025
    this.object.rotation.y = -Math.PI * this.yRotation
    this.object.rotation.z = -Math.PI * this.xRotation
  }
}
