import * as THREE from 'three'
import GeneralLights from './sceneSubjects/GeneralLights'
import SceneSubject from './sceneSubjects/SceneSubject'
import Square from './sceneSubjects/Square'

export default class SceneManager {
  constructor (canvas) {
    this.clock = new THREE.Clock()
    this.canvas = canvas
    this.screenDimensions = {
      width: canvas.width,
      height: canvas.height
    }
    this.scene = this.buildScene()
    this.renderer = this.buildRender(this.screenDimensions)
    this.camera = this.buildCamera(this.screenDimensions)
    this.sceneSubjects = this.createSceneSubjects(this.scene)
  }

  destroy () {
    this.scene = null
    this.renderer = null
    this.camera = null
    this.sceneSubjects.forEach(subject => subject.destroy())
  }

  buildScene () {
    const scene = new THREE.Scene()
    // scene.background = new THREE.Color(0xcc00cc)
    return scene
  }

  buildRender ({ width, height }) {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    })
    const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1
    renderer.setPixelRatio(DPR)
    renderer.setSize(width, height)

    renderer.gammaInput = true
    renderer.gammaOutput = true

    return renderer
  }

  buildCamera ({ width, height }) {
    const aspectRatio = width / height
    const fieldOfView = 40
    const nearPlane = 1
    const farPlane = 10000
    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    )
    camera.position.set(0, 0, 200)
    return camera
  }

  createSceneSubjects (scene) {
    const sceneSubjects = [
      new GeneralLights(scene),
      new SceneSubject(
        scene,
        this.visibleWidthAtZDepth(0, this.camera),
        this.visibleHeightAtZDepth(0, this.camera)
      )
    ]
    return sceneSubjects
  }

  update () {
    const elapsedTime = this.clock.getElapsedTime()

    for (let i = 0; i < this.sceneSubjects.length; i++) {
      this.sceneSubjects[i].update(elapsedTime)
    }

    this.renderer.render(this.scene, this.camera)
  }

  onWindowResize () {
    const { width, height } = this.canvas.getBoundingClientRect()
    
    this.screenDimensions.width = width
    this.screenDimensions.height = height

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    for (let i = 1; i < this.sceneSubjects.length; i++) {
      this.sceneSubjects[i].onWindowResize(
        this.visibleWidthAtZDepth(0, this.camera),
        this.visibleHeightAtZDepth(0, this.camera)
      )
    }


    this.renderer.setSize(width, height)
  }

  visibleHeightAtZDepth (depth, camera) {
    // compensate for cameras not positioned at z=0
    const cameraOffset = camera.position.z
    if (depth < cameraOffset) depth -= cameraOffset
    else depth += cameraOffset

    // vertical fov in radians
    const vFOV = camera.fov * Math.PI / 180

    // Math.abs to ensure the result is always positive
    return 2 * Math.tan(vFOV / 2) * Math.abs(depth)
  }

  visibleWidthAtZDepth (depth, camera) {
    // compensate for cameras not positioned at z=0
    const cameraOffset = camera.position.z
    if (depth < cameraOffset) depth -= cameraOffset
    else depth += cameraOffset

    const vFOV = camera.fov * Math.PI / 180
    const hFOV = 2 * Math.atan(Math.tan(vFOV / 2) * camera.aspect)
    return 2 * Math.tan((hFOV / 2)) * Math.abs(depth)
    // const height = this.visibleHeightAtZDepth(depth, camera)

    // const hFOV = height * camera.aspect
    // return height * camera.aspect
  }
}
