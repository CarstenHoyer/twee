import * as THREE from 'three'
import GeneralLights from './sceneSubjects/GeneralLights'
import SceneSubject from './sceneSubjects/SceneSubject'

export default canvas => {
  const clock = new THREE.Clock()

  const screenDimensions = {
    width: canvas.width,
    height: canvas.height
  }
  const scene = buildScene()
  const renderer = buildRender(screenDimensions)
  const camera = buildCamera(screenDimensions)
  const sceneSubjects = createSceneSubjects(scene)

  function buildScene () {
    return new THREE.Scene()
    // scene.background = new THREE.Color(0xff0000)
    // return scene
  }

  function buildRender ({ width, height }) {
    const renderer = new THREE.WebGLRenderer({
      canvas,
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

  function buildCamera ({ width, height }) {
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
    camera.position.set(200, 200, 2000)
    // camera.rotation.x = -0.3
    // camera.rotation.x = 0.2
    // camera.rotation.y = 0.2//-Math.PI * .65
    // this.line.rotation.z = -Math.PI * 1.15;
    return camera
  }

  function createSceneSubjects (scene) {
    const sceneSubjects = [
      new GeneralLights(scene),
      new SceneSubject(scene)
    ]
    return sceneSubjects
  }

  function update () {
    const elapsedTime = clock.getElapsedTime()

    for (let i = 0; i < sceneSubjects.length; i++) {
      sceneSubjects[i].update(elapsedTime)
    }

    const pos = camera.position
    // camera.position.set(pos.x + 1, pos.y + 1, 2000)

    renderer.render(scene, camera)
  }

  function onWindowResize () {
    const { width, height } = canvas

    screenDimensions.width = width
    screenDimensions.height = height

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
  }

  return {
    update,
    onWindowResize
  }
}
