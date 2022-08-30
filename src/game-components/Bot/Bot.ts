import { ArrowHelper, ColorRepresentation, Vector3 } from 'three'
import Player from '../Player/Player'
import Ship from '../Ship/Ship'

enum Behaviours {FLEE = 'flee', CHASE = 'chase', ATTACK = 'attack', PEACEFULL = 'peacefull'};
class Decision {
  behaviour: Behaviours
  ship: Ship
}

export default class Bot extends Player {
  private readonly _decisionFrequency = 200 // 0.2 seconds
  private _targetShip: Ship
  private readonly _minimunAimingDistance = 2
  private _behaviour: Behaviours = Behaviours.CHASE
  private _chasedPoint: Vector3 = new Vector3(10, 10, 3)
  private _shootInterval: NodeJS.Timer
  private _rafId: number
  private _decisionIntervalId: NodeJS.Timer

  public get behaviour (): Behaviours { return this._behaviour }
  public set behaviour (value: Behaviours) {
    if (this._behaviour != value) {
      this._behaviour = value
      switch (value) {
        case Behaviours.FLEE:
          // this.ship.color = 0xFFFF00;
          this.fleeFrom(this._targetShip)
          break

        case Behaviours.ATTACK:
          // this.ship.color = 0xFF0000;
          this.attack(this._targetShip)
          break

        case Behaviours.CHASE:
          // this.ship.color = 0x6666FF;
          this.chase(this._targetShip)
          break

        case Behaviours.PEACEFULL:
          // TODO: Decidir o que fazer no modo peacefull

        default:
          break
      }
    }
  }

  constructor (color: ColorRepresentation) {
    super(`BOT-${Math.round(Math.random() * 10000)}`)

    // Criando a nave
    this.ship = new Ship(color)
    this.ship.drawLocalAxis()
    this.ship.drawDirection()
    this.ship.name = `SHIP-OF-${this.name}`
    this.ship.addEventListener('died', evt => {
      this.stopDecindingBehaviour()
      this.stopMovingShip()
    })
  }

  private fleeFrom (ship: Ship) {

  }

  private attack (ship: Ship) {
    this._chasedPoint = ship.position
    this._shootInterval = setInterval(() => { this.ship.shoot() }, 5000)
  }

  private chase (ship: Ship) {
    this._chasedPoint = ship.position
    clearInterval(this._shootInterval)
  }

  private startMovingShip () {
    this._rafId = requestAnimationFrame(() => this.startMovingShip())
    this.movePointerToChasePoint()
  }

  public movePointerToChasePoint (pointingSpeed: number = 18) {
    // Declarando vetor que aponta do chasedPoint à posição atual: d
    const d: Vector3 = this._chasedPoint.clone().sub(this.ship.position)

    // Obtendo o vetor p projetando o vetor d no vetor direção da nave
    const p: Vector3 = d.clone().projectOnVector(this.ship.direction.normalize())

    // Obtendo o vetor u que é a projeção de d no plano da tela
    const u: Vector3 = d.clone().sub(p).normalize()

    // Representando u no sistema de coordenadas local
    const t = u.clone().applyQuaternion(this.ship.quaternion.clone().conjugate())

    // Redimensionando o vetor de mudança de direção
    t.multiplyScalar(pointingSpeed)

    // Mudando a direção da nave
    this.ship.pointTo(t.x, -t.y)
  }

  public init () {
    this.ship.startMovingForward()
    const decision = this.decideBehaviour()
    this._targetShip = decision.ship
    this.behaviour = decision.behaviour
    this.startMovingShip()
    this.startDescidingBehaviour()
  }

  private startDescidingBehaviour () {
    // Iniciando decisão perpétuo
    this._decisionIntervalId = setInterval(() => {
      const decision = this.decideBehaviour()
      this._targetShip = decision.ship
      this.behaviour = decision.behaviour
    }, this._decisionFrequency)
  }

  private stopDecindingBehaviour () {
    clearInterval(this._decisionIntervalId)
  }

  private stopMovingShip () {
    cancelAnimationFrame(this._rafId)
  }

  private decideBehaviour (): Decision {
    // Determinando as variáveis de retorno
    const decision: Decision = {
      behaviour: undefined,
      ship: undefined
    }

    // Verificando se existem inimigos
    if (this.enemies.length == 0) {
      return { behaviour: Behaviours.PEACEFULL, ship: undefined }
    }

    // Levantando as naves inimigas
    const enemyShips = this.enemies.map(e => e.ship)

    // Levantando vetores de mira em mim
    const aimVectors = this.ship.aimVectorsOnMe

    // Verificando tamanho de vetores de mira.
    // Quanto menor, mais perigoso
    let index = 0
    let minLength = aimVectors[0] != undefined ? aimVectors[0].length() : Infinity
    for (let i = 0; i < aimVectors.length; i++) {
      const length = aimVectors[i] != undefined ? aimVectors[i].length() : Infinity
      if (length < minLength) {
        index = i
        minLength = length
      }
    }

    // Verificando se a menor distância é menor que o tolerável
    if (minLength < this._minimunAimingDistance) {
      decision.behaviour = Behaviours.FLEE
      decision.ship = enemyShips[index]
      return decision
    }

    // Distâncias entre as naves inimigas e a própria nave
    const { ship: closestShip, distance } = enemyShips.reduce(
      (previous, current, currentIndex) => {
        const previousDistance = previous.ship.position.distanceTo(this.ship.position)
        const currentDistance = current.position.distanceTo(this.ship.position)

        if (currentDistance <= previousDistance) {
          return { ship: enemyShips[currentIndex], distance: currentDistance }
        } else {
          return { ship: enemyShips[currentIndex - 1], distance: previousDistance }
        }
      }
      ,
      { ship: enemyShips[0], distance: this.ship.position.distanceTo(enemyShips[0].position) }
    )

    // Se a menor distância entre a própria nave e a nave inimiga for menor que o alcance de ataque, atacar!
    // Caso contrário, perseguir
    if (distance <= this.ship.attackRange) {
      return { behaviour: Behaviours.ATTACK, ship: closestShip }
    } else {
      return { behaviour: Behaviours.CHASE, ship: closestShip }
    }
  }
}
