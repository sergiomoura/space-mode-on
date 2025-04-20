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
  Object3DEventMap,
  Object3D
} from 'three';
import { GetDeviceType, DeviceType } from '../../lib/GetDeviceType';

import Lights from '../Lights/Lights';
import Cameras from '../Cameras/Cameras';
import Ship from '../Ship/Ship';
// import MobileShipControls from '../../controls/MobileShipControls';
import DesktopShipControls from '../../controls/DesktopShipControls';
import FirstPersonShip from '../FirstPersonShip/FirstPersonShip';
import Bot from '../Bot/Bot';
import Player from '../Player/Player';
import User from '../User/User';
import GameEvents, { GameEventsMap } from '../../lib/GameEvents';
import { ShipEvents } from '../Ship/ShipEvents';
import { GameModels } from '../../models/GameModels';

// const COLOR_MAIN_PLAYER: number = 0xCCCCCC;
const COLOR_ENEMIES: number = 0xFF0000;
const COLOR_FRIENDS: number = 0x6666FF;


export default class Game extends Object3D<GameEventsMap> {

  private mainRenderer: WebGLRenderer;
  private readonly mainCanvas: HTMLCanvasElement;
  private readonly auxCanvas: HTMLCanvasElement;
  private _shipControls: DesktopShipControls;
  private readonly _cameras: PerspectiveCamera[] = Cameras;
  private _showingCamera: PerspectiveCamera = this._cameras[0];
  private _mainPlayer: Player;
  public get mainPlayer (): Player { return this._mainPlayer; }

  private readonly _ships: Ship[] = [];
  public get ships (): Ship[] { return this._ships; };

  constructor (mainCanvas: HTMLCanvasElement, auxCanvas: HTMLCanvasElement, private models: GameModels) {
    
    super();

    // Associando canvas
    this.mainCanvas = mainCanvas;
    this.auxCanvas = auxCanvas;

    // Criando e configurando renders
    this.setRenders(this.mainCanvas);

    // Adicionando Iluminação
    this.add(...Lights);

    // Extras
    // this.addSpiningCube(10, 10, 3, 0xFF0000);
    this.drawAxis(5);
    // this.drawGrid(100,1);
  
  }

  start (
    playerName: string,
    nEnemies: number,
    nFriends: number,
    demoMode: boolean = false
  ): void {

    // Criando Jogador Principal
    this._mainPlayer = this.createMainPlayer(playerName);

    // Criando Time A
    const teamA: Player[] = this.createTeam(nFriends, true);

    // Criando Time B
    const teamB: Player[] = this.createTeam(nEnemies, false);

    // Configurando amizades e inimizades entre times
    teamA.forEach(p => { p.addEnemies(...teamB); p.addFriends(...teamA); });
    teamB.forEach(p => { p.addEnemies(...teamA); p.addFriends(...teamB); });

    // Verificando se está em modo demo ou não
    if (!demoMode) {

      // Não está em demo. Conectando controles
      this.connectControls();
    
    }
    
    // Adicionando nave do mainPlayer
    this.addShip(this._mainPlayer.ship);

    // Iniciando bots
     [...teamA, ...teamB].forEach(
      (p: Player) => {
        if (p instanceof Bot) { p.init(); }
     }
    );

    // Renderizando continuamente
    this.renderContinuous();

  }

  private createMainPlayer (playerName: string): Player {

    const player = new User(playerName, this.models.ship);

    // Adicionando listeners à nave do player
    player.ship.addEventListener(
      ShipEvents.SHIP_DESTROYED,
      () => { this.dispatchEvent({ type: GameEvents.MAIN_PLAYER_DIED }); }
    );

    // Definindo posição inicial da nave do player
    player.ship.position.x = 5;
    player.ship.position.y = 5;
    player.ship.position.z = 5;
    player.ship.rotateX(-0.3);

    return player;
    
  }

  private createTeam (nPlayers: number, friendly: boolean): Player[] {

    const team: Player[] = [];
    let color: number = COLOR_ENEMIES;

    if (friendly) {

      team.push(this._mainPlayer);
      color = COLOR_FRIENDS;
    
    }
    
    for (let i = 0; i < nPlayers; i++) {

      const bot = new Bot(color, this.models.ship);
      team.push(bot);

      // Posicionando bot em local aleatório
      bot.ship.position.set(Math.random() * 10, Math.random() * 10, Math.random() * 10);

      this.addShip(bot.ship);
    
    }
    return team;
     
  }

  private setRenders (mainCanvas: HTMLCanvasElement): void {

    // Criando o renderer principal
    this.mainRenderer = new WebGLRenderer({ antialias: true, canvas: mainCanvas });
    this.mainRenderer.setSize(window.innerWidth, window.innerHeight);

  }

  public connectControls (): void {

    // Verificando o tipo de dispositivo para definir os controles.
    switch (GetDeviceType()) {
  
      case DeviceType.TABLET:
      case DeviceType.MOBILE:
        // this._shipControls = new MobileShipControls(this.mainPlayer.ship);
        break;
      default:
        this._shipControls = new DesktopShipControls(this, this.mainRenderer.domElement);
        this._shipControls.connect();
        break;
    
    }
  
  }

  private addShip (...ships: Ship[]): void {

    this.add(...ships);
    this._ships.push(...ships);
    
    // Adicionando listeners para as naves
    ships.forEach(
      ship => { this.handleShipEvents(ship); }
    );
  
  }

  private handleShipEvents (ship: Ship): void {

    // ship.addEventListener('shoot', this.onShipShoot);
    ship.addEventListener(ShipEvents.SHIP_GOT_DAMAGE, evt => { this.onShipGotDamage(evt.target, evt.damage); });
    ship.addEventListener(ShipEvents.SHIP_DESTROYED, evt => { this.onShipDestroyed(evt.target); });
  
  }

  private onShipDestroyed (ship: Ship): void {

    console.log(`${ship.name} foi destruída.`);

    // Caso nave destruída tenha sido do mainPlayer, dispare evento 'mainPlayerDied'
    if (ship.player === this.mainPlayer) {

      this.dispatchEvent({ type: GameEvents.MAIN_PLAYER_DIED });
      this._shipControls.disconnect();
    
    }

    // Removendo nave morta do vetor de inimigo dos bots
    ship.player.enemies.forEach(
      e => { e.enemies.splice(e.enemies.indexOf(ship.player), 1); }
    );

    // Verificando se o mainPlayer ainda tem inimigos
    if (this.mainPlayer.enemies.length === 0) {

      this.dispatchEvent({ type: GameEvents.MAIN_PLAYER_WON });
      this._shipControls.disconnect();
    
    }

    // delete evt.target
    // TODO: Descobrir como remover a nave...
  
  }

  private onShipGotDamage (ship: Ship, damage: number): void {

    console.log(`${ship.name} sofreu dano de ${damage}.`); // TODO: mostrar o dano sofrido
  
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
    this.mainRenderer.render(this, (<FirstPersonShip> this._mainPlayer.ship).camera);
  
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
  
  public suspend (): void {
    
    // TODO: Fazer para mobile
    (this._shipControls).unlock();
        
  }

}
