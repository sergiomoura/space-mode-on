import { BoxGeometry, MeshBasicMaterial, Mesh, Vector3, Raycaster, Object3D } from 'three'
import Ship from '../Ship/Ship'
import Game from '../Game/Game'
import Damageble from '../Damageble/Damageble'

export default class Shot extends Object3D {
  private readonly _hitbox: BoxGeometry = new BoxGeometry(0.1, 0.1, 1.1)
  private _hitboxMesh: Mesh
  private readonly _direction: Vector3
  private readonly _speed: number
  private _remainingDistance: number
  private _animationFrameId: number
  private readonly _raycaster: Raycaster
  private readonly _intersectables: Ship[]
  private _origin: Vector3
  private _worldDirection: Vector3

  public get hitbox (): BoxGeometry {
    return this._hitbox
  }

  constructor (
    private readonly _velocity: Vector3,
    private readonly _demage: number,
    private readonly _reach: number,
    private readonly _ownerShip: Ship
  ) {
    super()
    this.drawHitBox()
    this._direction = this._velocity.clone().normalize()
    this._speed = this._velocity.length()
    this._remainingDistance = _reach
    this._intersectables = _ownerShip.player.enemies.map(b => b.ship)
    _ownerShip.addEventListener(
      'shoot',
      () => {
        this._origin = _ownerShip.position.clone()
        this._worldDirection = this._direction.clone().applyMatrix4(_ownerShip.matrixWorld).sub(_ownerShip.position)
      }
    )
    this.move()
  }

  drawHitBox (): void {
    const material = new MeshBasicMaterial({ color: 0xff0000 })
    this._hitboxMesh = new Mesh(this.hitbox, material)
    this.add(this._hitboxMesh)
  }

  move (): void {
    this._animationFrameId = requestAnimationFrame(() => { this.move() })
    if (this._remainingDistance > 0) {
      this.translateOnAxis(this._direction, this._speed)
      this._remainingDistance -= this._speed
      this.checkHit()
    } else {
      cancelAnimationFrame(this._animationFrameId)
      this.removeFromParent()
    }
  }

  private checkHit (): void {
    if (this.parent != null) {
      const origin: Vector3 = this.position.clone()

      const rc: Raycaster = new Raycaster(origin, this._worldDirection)
      const intersections = rc.intersectObjects(this._intersectables, true)

      if (intersections.length > 0) {
        if (intersections[0].distance < this._velocity.length()) {
          // Verificando se a colisão foi contra algo danificável
          const damageble = this.damagebleParent(intersections[0].object)

          if (damageble !== undefined) {
            // Identificando o ponto de colisão
            const fi = intersections[0].point;

            // Adicionando spinningCube no ponto de colisão
            ((this._ownerShip.parent as Game)).addSpiningCube(fi.x, fi.y, fi.z)

            // Causando dano
            damageble.getDamage(this._demage)

            // Removendo o tiro
            // for better memory management and performance
            this._hitbox.dispose()
            this._hitboxMesh.removeFromParent()
            this.removeFromParent()
          }
        }
      }
    }
  }

  private damagebleParent (obj: Object3D): Damageble | undefined {
    if (this.isDamageble(obj)) { return obj as Damageble };
    if (obj.parent == null || obj.parent === undefined) { return undefined };
    return this.damagebleParent(obj.parent)
  }

  private isDamageble (obj: any): obj is Damageble {
    return ('life' in obj && 'getDamage' in obj && 'die' in obj)
  }
}
