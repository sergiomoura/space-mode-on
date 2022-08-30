import { EventDispatcher } from 'three'
import Ship from '../game-components/Ship/Ship'

const frac = Math.PI / 8
const MaxTanDireita = Math.tan(3 * frac)
const MinTanDireita = -Math.tan(3 * frac)

class MobileShipControls extends EventDispatcher{
  private readonly _directionalScreen: HTMLDivElement
  private readonly _btShooter: HTMLButtonElement
  private readonly _btDasher: HTMLButtonElement
  private readonly _btJoystick: HTMLButtonElement
  private _previousTouch: Touch

  constructor (private readonly _ship: Ship) {
    super()
    this._directionalScreen = <HTMLDivElement>document.getElementById('mobile-controls')
    this._btShooter = <HTMLButtonElement>document.getElementById('shooter')
    this._btDasher = <HTMLButtonElement>document.getElementById('dasher')
    this._btJoystick = <HTMLButtonElement>document.getElementById('joystick')

    this.associateEvents()
  }

  private associateEvents () {
    this.connectBtShooter()
    this.connectBtDasher()
    this.connectBtJoystick()
    this.connectDirectionalScreen()
  }

  private connectBtShooter () {
    this._btShooter.addEventListener(
      'touchstart',
      (evt) => {
        evt.cancelBubble = true
        evt.stopPropagation()
        this._ship.shoot()
      }
    )
  }

  private connectBtDasher () {
    this._btDasher.addEventListener(
      'touchend',
      evt => {
        evt.cancelBubble = true
        evt.stopPropagation()

        this._ship.dash()
      }
    )
  }

  private connectBtJoystick () {
    this._btJoystick.addEventListener(
      'touchmove',
      evt => {
        evt.cancelBubble = true
        evt.stopPropagation()

        const touch = evt.changedTouches[0]

        if (touch.target == this._btJoystick) {
          const x = touch.clientX - this._btJoystick.offsetLeft - this._btJoystick.offsetWidth / 2 + 1
          const y = touch.clientY - this._btJoystick.offsetTop - this._btJoystick.offsetHeight / 2 + 1
          let ratio = y / x

          if (x > 0 && ratio < MaxTanDireita && ratio > MinTanDireita) {
            this._ship.startMovingRight()
          } else {
            this._ship.stopMovingRight()
          }

          if (x < 0 && ratio < MaxTanDireita && ratio > MinTanDireita) {
            this._ship.startMovingLeft()
          } else {
            this._ship.stopMovingLeft()
          }

          ratio = x / -y

          if (y < 0 && ratio < MaxTanDireita && ratio > MinTanDireita) {
            this._ship.startMovingForward()
          } else {
            this._ship.stopMovingForward()
          }

          if (y > 0 && ratio < MaxTanDireita && ratio > MinTanDireita) {
            this._ship.startMovingBackwards()
          } else {
            this._ship.stopMovingBackwards()
          }
        }
      }
    )

    this._btJoystick.addEventListener('touchend', evt => {
      evt.stopPropagation()
      evt.cancelBubble = true

      this._ship.stopMovingForward()
      this._ship.stopMovingBackwards()
      this._ship.stopMovingRight()
      this._ship.stopMovingLeft()
    })
  }

  private connectDirectionalScreen () {
    this._directionalScreen.addEventListener('touchstart', evt => {
      evt.preventDefault()
      evt.stopPropagation()

      if (evt.changedTouches[0].target == this._directionalScreen) {
        this._previousTouch = evt.changedTouches[0]
      }
    })

    this._directionalScreen.addEventListener('touchmove', evt => {
      evt.preventDefault()
      evt.stopPropagation()

      const touch = evt.changedTouches[0]

      if (touch.target == this._directionalScreen) {
        let movementX
        let movementY

        movementX = touch.clientX - this._previousTouch.clientX
        movementY = touch.clientY - this._previousTouch.clientY

        this._ship.pointTo(movementX, movementY, 0.01)
        this._previousTouch = touch
      }
    })
  }
}

export default MobileShipControls
