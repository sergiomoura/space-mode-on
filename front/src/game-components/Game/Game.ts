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
} from "three";
import {GetDeviceType} from "../../lib/GetDeviceType";
import {DeviceType} from "../../lib/GetDeviceType";
import Lights from "../Lights/Lights";
import Cameras from "../Cameras/Cameras";
import Ship from "../Ship/Ship";
import MobileShipControls from "../../controls/MobileShipControls";
import { DesktopShipControls } from "../../controls/DesktopShipControls";
import DesktopGameControls from "../../controls/DesktopGameControls";
import FirstPersonShip from "../FirstPersonShip/FirstPersonShip";
import Bot from "../Bot/Bot";
import Player from "../Player/Player";
import User from "../User/User";

export default class Game extends Scene{

    private _mainRenderer:WebGLRenderer;
    private _auxRenderer:WebGLRenderer;
    private _shipControls:DesktopShipControls;
    private _gameControls:DesktopGameControls;
    private _cameras:PerspectiveCamera[] = Cameras;
    private _showingCamera:PerspectiveCamera = this._cameras[0];
    private _mainPlayer:Player;
    
    private _ships:Ship[] = [];
    public get ships() : Ship[] {return this._ships};

    constructor(
        height:number,
        width:number,
        mainCanvas:HTMLCanvasElement,
        auxCanvas:HTMLCanvasElement,
        playerName:string
    ) {

        super();

        // Criando Jogador Principal
        this._mainPlayer = new User(playerName);

        // Criando Time A
        let teamA:Player[] = []
        teamA.push(this._mainPlayer)
        for (let i = 0; i < 4; i++) {
            let bot = new Bot(0x6666FF);
            teamA.push(bot);
            this.addShip(bot.ship);
        }

        // Criando Time B
        let teamB:Player[] = []
        for (let i = 0; i < 4; i++) {
            let bot = new Bot(0xFF0000);
            teamB.push(bot);
            this.addShip(bot.ship);
            bot.ship.position.set(5*(Math.random()-0.5),5*(Math.random()-0.5),5*(Math.random()-0.5));
            bot.ship.pointTo(500*(Math.random()-0.5),500*(Math.random()-0.5))
        }

        // Configurando amizades e inimizades
        teamA.forEach(p => {p.addEnemies(...teamB);p.addFriends(...teamA)});
        teamB.forEach(p => {p.addEnemies(...teamA);p.addFriends(...teamB)});

        // Criando o renderer principal
        this._mainRenderer = new WebGLRenderer({ antialias: true, canvas:mainCanvas});

        // Criando o renderer auxiliar
        this._auxRenderer = new WebGLRenderer({ antialias:false, canvas:auxCanvas});

        // Verificando o tipo de dispositivo para definir os controles.
        switch (GetDeviceType()) {
            case DeviceType.TABLET:
            case DeviceType.MOBILE:
                new MobileShipControls(this._mainPlayer.ship);
                // return;
                break;
            default:
                this._shipControls = new DesktopShipControls(this._mainPlayer.ship, this._mainRenderer.domElement);
                this._gameControls = new DesktopGameControls(this);
       
                break;
        }

        // Instanciando controles de nave de do jogo

        // Determinando dimensões do renderer principal
        this.setSize(height, width);

        // Adicionando Iluminação
        this.add(...Lights);

        // Adicionando Nave do Main Player
        this._mainPlayer.ship.position.x = 5;
        this._mainPlayer.ship.position.y = 5;
        this._mainPlayer.ship.position.z = 5;
        this._mainPlayer.ship.rotateX(-0.3)
        // this._mainPlayer.ship.rotateY(Math.PI)
        this.addShip(this._mainPlayer.ship);

        // Configurando renderizadores
        this._auxRenderer.setClearColor(0x333333, 0.5)

        // Extras
        this.addSpiningCube(10, 10, 3, 0xFF0000);
        this.drawAxis(5);
        // this.drawGrid(100,1);

        // Iniciando bots
        [...teamA, ...teamB].forEach(
            (p:Player) => {
                if(p instanceof Bot){p.init()}
            }
        )

        // Renderizando continuamente
        this.renderContinuous();
    }

    public setSize(height: number, width: number) {
        this._mainRenderer.setSize(width, height);
    }

    public addShip(ship:Ship){
        this.add(ship);
        this._ships.push(ship);
        this.handleShipEvents(ship);
    }
    
    private handleShipEvents(ship:Ship){
        // ship.addEventListener('shoot', this.onShipShoot);
        ship.addEventListener('gotDamage', this.onShipGotDamage);
        ship.addEventListener('died', this.onShipDeath);

    }
    
    private onShipDeath(evt:Event & {type: 'died'} & {target: Ship}){
        console.log(`${evt.target.name} foi destruída.`);
        evt.target.player.enemies.forEach(
            e=>{
                e.enemies.splice(e.enemies.indexOf(evt.target.player),1);
            }
        )
        delete evt.target;
    }

    private onShipGotDamage(evt:Event & {type: 'gotDamage'} & {target: Ship}){
        console.log(`${evt.target.name} sofreu dano de ___.`); // TODO: mostrar o dano sofrido
    }

    public addSpiningCube(x:number = 0, y:number = 0, z:number = 0, color:ColorRepresentation = 0xff0000) {

        const geometry = new BoxGeometry(0.1, 0.1, 0.1);
        const material = new MeshPhongMaterial({ color });
        material.opacity = 0.5;
        material.transparent = true;
        const cube = new Mesh(geometry, material);
        cube.position.set(x,y,z);
        cube.castShadow = true;
        cube.receiveShadow = true;
        this.add(cube);

        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.03;
            cube.rotation.y += 0.06;
            cube.rotation.z += 0.03;
        };

        animate();
    }

    public drawAxis(size:number){

        let helperX= new ArrowHelper(new Vector3(1,0,0), new Vector3(),size, 0x0000FF);
        let helperY= new ArrowHelper(new Vector3(0,1,0), new Vector3(),size, 0xFFFF00);
        let helperZ= new ArrowHelper(new Vector3(0,0,1), new Vector3(),size, 0xFF0000);

        this.add(helperX,helperY,helperZ);

   }

    public drawLine(color:ColorRepresentation, ...points:Vector3[]){
        const material = new LineBasicMaterial( { color } );
        
        let geometry:BufferGeometry;
        let line:Line;
        
        geometry = new BufferGeometry().setFromPoints(points);
        line = new Line( geometry, material );
        this.add(line);

    }

    public drawGrid(size:number, step:number){
        for (let i = -size; i <= size; i+=step) {
            this.drawLine(0x003300,new Vector3( - size, i, 0 ), new Vector3( size, i, 0 ));
            this.drawLine(0x003300,new Vector3( i, -size, 0 ), new Vector3( i, size, 0 ));

            this.drawLine(0x330000,new Vector3( 0, i, -size ), new Vector3( 0, i, size ));
            this.drawLine(0x330000,new Vector3( 0, -size, i ), new Vector3( 0, size , i));

            this.drawLine(0x000033,new Vector3( i, 0, -size ), new Vector3( i, 0, size ));
            this.drawLine(0x000033,new Vector3( -size, 0, i ), new Vector3( size, 0 , i));

            this.drawLine(0x003300,new Vector3( - size, i, 0 ), new Vector3( size, i, 0 ));
            this.drawLine(0x003300,new Vector3( i, -size, 0 ), new Vector3( i, size, 0 ));

            this.drawLine(0x330000,new Vector3( 0, i, -size ), new Vector3( 0, i, size ));
            this.drawLine(0x330000,new Vector3( 0, -size, i ), new Vector3( 0, size , i));

            this.drawLine(0x000033,new Vector3( i, 0, -size ), new Vector3( i, 0, size ));
            this.drawLine(0x000033,new Vector3( -size, 0, i ), new Vector3( size, 0 , i));
        }
    }

    public renderContinuous(){
        requestAnimationFrame(()=>{this.renderContinuous()});
        this._mainRenderer.render(this, (<FirstPersonShip>this._mainPlayer.ship).camera);
        this._auxRenderer.render(this, this._showingCamera);
    }

    switchNextCamera() {
        let pos = this._cameras.indexOf(this._showingCamera);
        if(pos == this._cameras.length - 1){
            this._showingCamera = this._cameras[0]
        } else {
            this._showingCamera = this._cameras[pos + 1];
        }
    }
    
    switchToPreviousCamera() {
        let pos = this._cameras.indexOf(this._showingCamera);
        if(pos == 0){
            this._showingCamera = this._cameras[this._cameras.length - 1]
        } else {
            this._showingCamera = this._cameras[pos - 1];
        }
    }
}