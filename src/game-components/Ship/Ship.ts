import {
  BoxGeometry,
  Group,
  MeshPhongMaterial,
  Mesh,
  Vector3,
  Euler,
  ColorRepresentation,
  ArrowHelper
} from 'three';
import Damageble from '../Damageble/Damageble';
import Player from '../Player/Player';
import Shot from '../Shot/Shot';
import { ShipEvents, ShipEventsMap } from './ShipEvents';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

const _euler = new Euler(0, 0, 0, 'YXZ');
const _PI_2 = Math.PI / 2;

export default class Ship extends Group<ShipEventsMap> implements Damageble {

  private readonly _defaults = {
    fwMaxSpeed: 0.1,
    bwMaxSpeed: 0.1,
    rMaxSpeed: 0.1,
    lMaxSpeed: 0.1,
    fwAcceleration: 0.004,
    bwAcceleration: 0.004,
    rAcceleration: 0.004,
    lAcceleration: 0.004,
    fwDeacceleration: 0.004,
    bwDeacceleration: 0.004,
    rDeacceleration: 0.004,
    lDeacceleration: 0.004,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,
    pointingSpeed: 1,
    attakRange: 20,
    dashDuration: 3000,
    dashSpeed: 0.5,
    dashCooldown: 5000,
  };

  private _attackRange: number = this._defaults.attakRange;
  private _minTimeBetweenShots: number = 500; // in milliseconds
  private _readyToShoot: boolean = true;
  private _damage: number = 20;
  private _attack: number = 1000;
  private _rafId: number;
  public set attackRange (value: number) { this._attackRange = value; }
  public get attackRange (): number { return this._attackRange; }


  private readonly _hitBoxGeometry: BoxGeometry;
  private _hitBoxMesh: Mesh;
  public readonly maxLife: number = 100;
  private _life: number = 100;
  private _alive: boolean;
  public get alive (): boolean { return this._alive; }
  public set alive (value: boolean) {

    console.log(`${this.name} setando alive como ${value.toString()}`);
    this._alive = value;
  
  }

  private readonly _direction: Vector3 = new Vector3(0, 0, 0);
  public get direction (): Vector3 {

    return this.localToWorld(new Vector3(0, 0, -1)).sub(this.position);
  
  }

  private readonly _oposite: Vector3 = new Vector3(0, 0, 0);
  private readonly _right: Vector3 = new Vector3(0, 0, 0);
  private readonly _left: Vector3 = new Vector3(0, 0, 0);

  private _fwSpeed: number = 0;
  private _bwSpeed: number = 0;
  private _rSpeed: number = 0;
  private _lSpeed: number = 0;

  private _fwAcceleration: number = 0;
  private _bwAcceleration: number = 0;
  private _rAcceleration: number = 0;
  private _lAcceleration: number = 0;

  private _fwDeacceleration: number = 0;
  private _bwDeacceleration: number = 0;
  private _rDeacceleration: number = 0;
  private _lDeacceleration: number = 0;

  private _fwMaxSpeed: number;
  private _bwMaxSpeed: number;
  private _rMaxSpeed: number;
  private _lMaxSpeed: number;

  private _color: ColorRepresentation;
  
  private _player: Player;
  public get player (): Player { return this._player; }
  public set player (value: Player) { this._player = value; }
  
  constructor (model: GLTF) {
    
    // Chamando contrutor do pai
    super();

    // Adicionando model
    
    this.add(model.scene.clone());

    const initiateMoving = true;

    // Definindo a cor
    this._color = 0xff0000;

    // Definindo e desenhando hitBox
    this._hitBoxGeometry = new BoxGeometry(1, 1, 2);
    this.drawHitBox();

    // Determinando o vetor da direção da câmera
    this.getWorldDirection(this._direction).multiplyScalar(-1);

    // Determinando o vetor oposto à direção da câmera
    this._oposite = this._direction.clone().multiplyScalar(-1);

    // Determinando o vetor da posição;
    this.getWorldPosition(this.position);

    // Determinando vetor para a direita
    this._right = this.localToWorld(new Vector3(1, 0, 0)).sub(this.position);

    // Determinando o vetor para a esquerda;
    this._left = this._right.clone().multiplyScalar(-1);

    // Determinando valores padrão
    this._fwMaxSpeed = this._defaults.fwMaxSpeed;
    this._bwMaxSpeed = this._defaults.bwMaxSpeed;
    this._rMaxSpeed = this._defaults.rMaxSpeed;
    this._lMaxSpeed = this._defaults.lMaxSpeed;


    // Iniciando movimento perpétuo caso tenha sido construido com
    // initiateMoving true
    if (initiateMoving) {

      this.alive = true;
      this.move();
    
    }
  
  }

  public get life (): number {

    return this._life;
  
  }

  public getDamage (damage: number): void {

    this._life -= damage;
    this.dispatchEvent({ type: ShipEvents.SHIP_GOT_DAMAGE, damage });
    if (this._life <= 0) {

      this.die();
    
    }
  
  }

  public die (): void {

    this.alive = false;
    this._hitBoxGeometry.dispose();
    this._hitBoxMesh.removeFromParent();
    this.clear();
    this.removeFromParent();
    this.dispatchEvent({ type: ShipEvents.SHIP_DESTROYED });
    console.log('--------------------------------');
    console.log('Morreu');
    console.log(this.alive);
  
  }

  private move (): void {
    
    if (this._alive) {

      // Iniciando movimento perpétuo
      this._rafId = requestAnimationFrame(() => { this.move(); });
  
      // Atualizando velocidade com aceleração
      if (this._fwSpeed < this._fwMaxSpeed) { this._fwSpeed += this._fwAcceleration; }
      if (this._bwSpeed < this._bwMaxSpeed) { this._bwSpeed += this._bwAcceleration; }
      if (this._rSpeed < this._rMaxSpeed) { this._rSpeed += this._rAcceleration; }
      if (this._lSpeed < this._lMaxSpeed) { this._lSpeed += this._lAcceleration; }
  
      if (this._fwSpeed > 0) { this._fwSpeed -= this._fwDeacceleration; }
      if (this._bwSpeed > 0) { this._bwSpeed -= this._bwDeacceleration; }
      if (this._rSpeed > 0) { this._rSpeed -= this._rDeacceleration; }
      if (this._lSpeed > 0) { this._lSpeed -= this._lDeacceleration; }
  
      // Atualizando posição com velocidade
      this.translateOnAxis(this._direction, this._fwSpeed);
      this.translateOnAxis(this._oposite, this._bwSpeed);
      this.translateOnAxis(this._right, this._rSpeed);
      this.translateOnAxis(this._left, this._lSpeed);

    } else {

      cancelAnimationFrame(this._rafId);
    
    }
  
  }

  drawHitBox (): void {

    // TODO: Limpando o objeto caso exista algo nele
    // (this._hitBoxMesh.material as Material).dispose()
    // this._hitBoxMesh.geometry.dispose()
    // this.remove(this._hitBoxMesh)

    const material = new MeshPhongMaterial({ color: this._color });
    material.opacity = 0.0;
    material.transparent = true;
    this._hitBoxMesh = new Mesh(this._hitBoxGeometry, material);

    this._hitBoxMesh.castShadow = true;
    this._hitBoxMesh.receiveShadow = true;

    this.add(this._hitBoxMesh);
  
  }

  public get velocity (): Vector3 {

    const result = new Vector3();
    const resultP1 = new Vector3();
    const resultP2 = new Vector3();

    result.addVectors(

      resultP1.addVectors(
        this._direction.clone().multiplyScalar(this._fwSpeed),
        this._oposite.clone().multiplyScalar(this._bwSpeed)
      ),

      resultP2.addVectors(
        this._left.clone().multiplyScalar(this._lSpeed),
        this._right.clone().multiplyScalar(this._rSpeed)
      )
    );

    return result.applyEuler(this.rotation);
  
  }

  public startMovingForward (): void {

    this._fwAcceleration = this._defaults.fwAcceleration;
    this._fwDeacceleration = 0;
  
  }

  public stopMovingForward (): void {

    this._fwDeacceleration = this._defaults.fwDeacceleration;
    this._fwAcceleration = 0;
    
  }

  public startMovingBackwards (): void {

    this._bwAcceleration = this._defaults.bwAcceleration;
    this._bwDeacceleration = 0;
  
  }

  public stopMovingBackwards (): void {

    this._bwDeacceleration = this._defaults.bwDeacceleration;
    this._bwAcceleration = 0;
  
  }

  public startMovingRight (): void {

    this._rAcceleration = this._defaults.rAcceleration;
    this._rDeacceleration = 0;
  
  }

  public stopMovingRight (): void {

    this._rDeacceleration = this._defaults.rDeacceleration;
    this._rAcceleration = 0;
  
  }

  public startMovingLeft (): void {

    this._lAcceleration = this._defaults.lAcceleration;
    this._lDeacceleration = 0;
  
  }

  public stopMovingLeft (): void {

    this._lDeacceleration = this._defaults.lDeacceleration;
    this._lAcceleration = 0;
  
  }

  public pointTo (x: number, y: number, pointingSpeed: number = 0.002): void {

    _euler.setFromQuaternion(this.quaternion);

    _euler.y -= x * pointingSpeed * this._defaults.pointingSpeed;
    _euler.x -= y * pointingSpeed * this._defaults.pointingSpeed;

    _euler.x = Math.max(_PI_2 - this._defaults.maxPolarAngle, Math.min(_PI_2 - this._defaults.minPolarAngle, _euler.x));

    this.quaternion.setFromEuler(_euler);
  
  }

  public shoot (): void {
    if (!this._readyToShoot) { return; }

    const velocity = this._direction.clone().multiplyScalar(1);
    const shot: Shot = new Shot(velocity, this._damage, this._attackRange, this);
    shot.applyMatrix4(this.matrix);
    if (this.parent !== null) {

      this.parent.add(shot);
      this.dispatchEvent({ type: ShipEvents.SHIP_SHOOT, shot });
    
    }

    this._readyToShoot = false;
    setTimeout(() => {
      this._readyToShoot = true;
    }
    , this._minTimeBetweenShots);
  
  }

  public drawDirection (): void {

    const helper = new ArrowHelper(this._direction, new Vector3(), 5, 0x333333);
    this.add(helper);
  
  }

  public drawLocalAxis (): void {

    const helperX = new ArrowHelper(new Vector3(1, 0, 0), new Vector3(), 1, 0x0000FF);
    const helperY = new ArrowHelper(new Vector3(0, 1, 0), new Vector3(), 1, 0xFFFF00);
    const helperZ = new ArrowHelper(new Vector3(0, 0, 1), new Vector3(), 1, 0xFF0000);

    this.add(helperX, helperY, helperZ);
  
  }

  public getAimVector (s: Ship): Vector3 | undefined {

    // Calculando vetor normal ao plano que coincide com a direção da nave
    const normal = this.getWorldDirection(new Vector3()).multiplyScalar(-1);

    // Calculando o vetor da posição da nave inimiga com relação a nave
    const d = s.position.clone().sub(this.position);

    // Calculando o vetor distância da nave inimiga a reta da minha trajetória
    // Calcular somente se a nave inimiga estiver a frente da nave.
    let r: Vector3 | undefined;
    if (normal.dot(d) > 0) {

      r = d.clone().projectOnVector(normal).sub(d);
    
    } else {

      r = undefined;
    
    }

    /* ================= BLOCO QUE DESENHA OS VETORES ENVOLVIDOS NO CÁLCULO ==================  *
        // Desenhando a posição da nave com relação à nave inimiga
        this.parent.add(new ArrowHelper(d.clone().normalize(), this.position, d.length(), 0x006600));

        // Desenhando a normal: direção da nave
        this.parent.add(new ArrowHelper(normal, this.position, 1, 0xffff00));

        // Desenhando o vetor R
        if(r != undefined){
            this.parent.add(new ArrowHelper(r.clone().normalize(), s.position, r.length(), 0x660066));
        }
        /* ================= BLOCO QUE DESENHA OS VETORES ENVOLVIDOS NO CÁLCULO ==================  */

    return r;
  
  }

  public getAimVectors (): Array<(Vector3 | undefined)> {

    const enemyShips = this.player.enemies.map(e => e.ship);
    return enemyShips.map(s => this.getAimVector(s));
  
  }

  public get aimVectorsOnMe (): Array<(Vector3 | undefined)> {

    const enemyShips = this.player.enemies.map(e => e.ship);
    return enemyShips.map(s => s.getAimVector(this));
  
  }

  public dash(): void {

    this.dispatchEvent({ type: ShipEvents.SHIP_STARTED_DASH, duration: this._defaults.dashDuration, cooldown: this._defaults.dashCooldown });

    this._fwMaxSpeed = this._defaults.dashSpeed;
    this._bwMaxSpeed = this._defaults.dashSpeed;
    this._rMaxSpeed = this._defaults.dashSpeed;
    this._lMaxSpeed = this._defaults.dashSpeed;

    setTimeout(() => {

      this._fwMaxSpeed = this._defaults.fwMaxSpeed;
      this._bwMaxSpeed = this._defaults.bwMaxSpeed;
      this._rMaxSpeed = this._defaults.rMaxSpeed;
      this._lMaxSpeed = this._defaults.lMaxSpeed;

    }, this._defaults.dashDuration);
  
  }
}
