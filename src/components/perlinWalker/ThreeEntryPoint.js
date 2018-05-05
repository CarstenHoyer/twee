import SceneManager from './SceneManager'

export default class ThreeEntryPoint {
  constructor (containerElement) {
    this.canvas = this.createCanvas(document, containerElement)
    this.sceneManager = new SceneManager(this.canvas)
    this.resizeCanvas = this.resizeCanvas.bind(this)
    this.bindEventListeners()
    this.render()
  }

  destroy (containerElement) {
    containerElement.removeChild(this.canvas)
    this.canvas = null
    this.sceneManager.destroy()
    window.removeEventListener('resize', this.resizeCanvas)
  }

  createCanvas (document, containerElement) {
    const canvas = document.createElement('canvas')
    containerElement.appendChild(canvas)
    return canvas
  }

  bindEventListeners () {
    window.addEventListener('resize', this.resizeCanvas)
    this.resizeCanvas()
  }

  resizeCanvas () {
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'

    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight

    this.sceneManager.onWindowResize()
  }

  render (time) {
    if (!this.canvas) return
    window.requestAnimationFrame(this.render.bind(this))
    this.sceneManager.update()
  }
}
