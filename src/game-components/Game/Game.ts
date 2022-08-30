import {
  BoxGeometry,
  MeshPhongMaterial,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  LineBasicMaterial,
  Vector3,
  BufferGeometry,
  Line,
  ColorRepresentation,
  ArrowHelper,
  EventDispatcher
} from 'three';
import { GetDeviceType, DeviceType } from '../../lib/GetDeviceType';

import Lights from '../Lights/Lights';
import Cameras from '../Cameras/Cameras';
import Ship from '../Ship/Ship';
import MobileShipControls from '../../controls/MobileShipControls';
import DesktopShipControls from '../../controls/DesktopShipControls';
import DesktopGameControls from '../../controls/DesktopGameControls';
import FirstPersonShip from '../FirstPersonShip/FirstPersonShip';
import Bot from '../Bot/Bot';
import Player from '../Player/Player';
import User from '../User/User';

export default class Game extends Scene {

  private readonly _mainRenderer: WebGLRenderer;
  private readonly _auxRenderer: WebGLRenderer;
  private _shipControls: EventDispatcher;
  private _gameControls: DesktopGameControls;
  private readonly _cameras: PerspectiveCamera[] = Cameras;
  private _showingCamera: PerspectiveCamera = this._cameras[0];
  private readonly _mainPlayer: Player;

  private readonly _ships: Ship[] = [];
  public get ships (): Ship[] { return this._ships; };

  constructor (
    playerName: string,
    nEnimies: number,
    nFriends: number,
    demoMode: boolean = false
  ) {
    
    super();

    // Recuperando os canvas
    const mainCanvas = <HTMLCanvasElement> document.getElementById('mainCanvas');
    const auxCanvas = <HTMLCanvasElement> document.getElementById('auxCanvas');

    // Criando Jogador Principal
    this._mainPlayer = new User(playerName);

    // Adicionando listeners à nave do player
    this._mainPlayer.ship.addEventListener(
      'died',
      () => {

        this.dispatchEvent({ type: 'died' });
      
      }
    );

    // Criando Time A
    const teamA: Player[] = [];
    teamA.push(this._mainPlayer);
    for (let i = 0; i < nFriends; i++) {

      const bot = new Bot(0x6666FF);
      teamA.push(bot);
      this.addShip(bot.ship);
    
    }

    // Criando Time B
    const teamB: Player[] = [];
    for (let i = 0; i < nEnimies; i++) {

      const bot = new Bot(0xFF0000);
      teamB.push(bot);
      this.addShip(bot.ship);
      bot.ship.position.set(5 * (Math.random() - 0.5), 5 * (Math.random() - 0.5), 5 * (Math.random() - 0.5));
      bot.ship.pointTo(500 * (Math.random() - 0.5), 500 * (Math.random() - 0.5));
    
    }

    // Configurando amizades e inimizades
    teamA.forEach(p => { p.addEnemies(...teamB); p.addFriends(...teamA); });
    teamB.forEach(p => { p.addEnemies(...teamA); p.addFriends(...teamB); });

    // Criando o renderer principal
    this._mainRenderer = new WebGLRenderer({ antialias: true, canvas: mainCanvas });

    // Criando o renderer auxiliar
    this._auxRenderer = new WebGLRenderer({ antialias: false, canvas: auxCanvas });

    // Verificando se está em modo demo ou não
    if (demoMode) {

      // Está em modo demo. Escondendo mini mapa
      auxCanvas.style.display = 'none';
      
    } else {

      // Não está em demo. Conectando controles
      this.connectControls();
      auxCanvas.style.display = 'block';
    
    }

    // Instanciando controles de nave de do jogo

    // Determinando dimensões do renderer principal
    this.setSize(window.innerHeight, window.innerWidth);

    // Adicionando Iluminação
    this.add(...Lights);

    // Adicionando Nave do Main Player
    this._mainPlayer.ship.position.x = 5;
    this._mainPlayer.ship.position.y = 5;
    this._mainPlayer.ship.position.z = 5;
    this._mainPlayer.ship.rotateX(-0.3);
    // this._mainPlayer.ship.rotateY(Math.PI)
    this.addShip(this._mainPlayer.ship);

    // Configurando renderizadores
    this._auxRenderer.setClearColor(0x333333, 0.5);

    // Extras
    this.addSpiningCube(10, 10, 3, 0xFF0000);
    this.drawAxis(5);
    // this.drawGrid(100,1);

    // Iniciando bots
    [...teamA, ...teamB].forEach(
      (p: Player) => {

        if (p instanceof Bot) { p.init(); }
      
      }
    );

    // Renderizando continuamente
    this.renderContinuous();
  
  }

  public connectControls (): void {

    // Verificando o tipo de dispositivo para definir os controles.
    switch (GetDeviceType()) {
  
      case DeviceType.TABLET:
      case DeviceType.MOBILE:
        this._shipControls = new MobileShipControls(this._mainPlayer.ship);
        break;
      default:
        this._shipControls = new DesktopShipControls(this._mainPlayer.ship, this._mainRenderer.domElement);
        (<DesktopShipControls> this._shipControls).lock();
        this._gameControls = new DesktopGameControls(this);

        break;
    
    }
  
  }

  public suspend (): void {
    
    // TODO: Fazer para mobile
    (<DesktopShipControls> this._shipControls).unlock();
        
  }

  public setSize (height: number, width: number): void {

    this._mainRenderer.setSize(width, height);
  
  }

  public addShip (ship: Ship): void {

    this.add(ship);
    this._ships.push(ship);
    this.handleShipEvents(ship);
  
  }

  private handleShipEvents (ship: Ship): void {

    // ship.addEventListener('shoot', this.onShipShoot);
    ship.addEventListener('gotDamage', this.onShipGotDamage);
    ship.addEventListener('died', this.onShipDeath);
  
  }

  private onShipDeath (evt: Event & {type: 'died'} & {target: Ship}): void {

    console.log(`${evt.target.name} foi destruída.`);
    evt.target.player.enemies.forEach(
      e => {

        e.enemies.splice(e.enemies.indexOf(evt.target.player), 1);
      
      }
    );
    // delete evt.target
    // TODO: Descobrir como remover a nave...
  
  }

  private onShipGotDamage (evt: Event & {type: 'gotDamage'} & {target: Ship}): void {

    console.log(`${evt.target.name} sofreu dano de ___.`); // TODO: mostrar o dano sofrido
  
  }

  public addSpiningCube (x: number = 0, y: number = 0, z: number = 0, color: ColorRepresentation = 0xff0000): void {

    const geometry = new BoxGeometry(0.1, 0.1, 0.1);
    const material = new MeshPhongMaterial({ color });
    material.opacity = 0.5;
    material.transparent = true;
    const cube = new Mesh(geometry, material);
    cube.position.set(x, y, z);
    cube.castShadow = true;
    cube.receiveShadow = true;
    this.add(cube);

    const animate = (): void => {

      requestAnimationFrame(animate);
      cube.rotation.x += 0.03;
      cube.rotation.y += 0.06;
      cube.rotation.z += 0.03;
    
    };

    animate();
  
  }

  public drawAxis (size: number): void {

    const helperX = new ArrowHelper(new Vector3(1, 0, 0), new Vector3(), size, 0x0000FF);
    const helperY = new ArrowHelper(new Vector3(0, 1, 0), new Vector3(), size, 0xFFFF00);
    const helperZ = new ArrowHelper(new Vector3(0, 0, 1), new Vector3(), size, 0xFF0000);

    this.add(helperX, helperY, helperZ);
  
  }

  public drawLine (color: ColorRepresentation, ...points: Vector3[]): void {

    const material = new LineBasicMaterial({ color });

    const geometry: BufferGeometry = new BufferGeometry().setFromPoints(points);
    const line: Line = new Line(geometry, material);

    this.add(line);
  
  }

  public drawGrid (size: number, step: number): void {

    for (let i = -size; i <= size; i += step) {

      this.drawLine(0x003300, new Vector3(-size, i, 0), new Vector3(size, i, 0));
      this.drawLine(0x003300, new Vector3(i, -size, 0), new Vector3(i, size, 0));

      this.drawLine(0x330000, new Vector3(0, i, -size), new Vector3(0, i, size));
      this.drawLine(0x330000, new Vector3(0, -size, i), new Vector3(0, size, i));

      this.drawLine(0x000033, new Vector3(i, 0, -size), new Vector3(i, 0, size));
      this.drawLine(0x000033, new Vector3(-size, 0, i), new Vector3(size, 0, i));

      this.drawLine(0x003300, new Vector3(-size, i, 0), new Vector3(size, i, 0));
      this.drawLine(0x003300, new Vector3(i, -size, 0), new Vector3(i, size, 0));

      this.drawLine(0x330000, new Vector3(0, i, -size), new Vector3(0, i, size));
      this.drawLine(0x330000, new Vector3(0, -size, i), new Vector3(0, size, i));

      this.drawLine(0x000033, new Vector3(i, 0, -size), new Vector3(i, 0, size));
      this.drawLine(0x000033, new Vector3(-size, 0, i), new Vector3(size, 0, i));
    
    }
  
  }

  public renderContinuous (): void {

    requestAnimationFrame(() => { this.renderContinuous(); });
    this._mainRenderer.render(this, (<FirstPersonShip> this._mainPlayer.ship).camera);
    this._auxRenderer.render(this, this._showingCamera);
  
  }

  switchNextCamera (): void {

    const pos = this._cameras.indexOf(this._showingCamera);
    if (pos === this._cameras.length - 1) {

      this._showingCamera = this._cameras[0];
    
    } else {

      this._showingCamera = this._cameras[pos + 1];
    
    }
  
  }

  switchToPreviousCamera (): void {

    const pos = this._cameras.indexOf(this._showingCamera);
    if (pos === 0) {

      this._showingCamera = this._cameras[this._cameras.length - 1];
    
    } else {

      this._showingCamera = this._cameras[pos - 1];
    
    }
  
  }

}
