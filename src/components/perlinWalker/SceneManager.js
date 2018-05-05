import * as THREE from 'three'
import GeneralLights from './sceneSubjects/GeneralLights'
import SceneSubject from './sceneSubjects/SceneSubject'

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
    return new THREE.Scene()
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
    const fieldOfView = 60
    const nearPlane = 1
    const farPlane = 10000
    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    )
    camera.position.set(0, 0, 1000)
    return camera
  }

  createSceneSubjects (scene) {
    const sceneSubjects = [
      new GeneralLights(scene),
      new SceneSubject(scene)
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
    const { width, height } = this.canvas

    this.screenDimensions.width = width
    this.screenDimensions.height = height

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(width, height)
  }
}
