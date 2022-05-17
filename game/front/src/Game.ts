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
} from "three";
import Lights from "./Lights";
import Cameras from "./Cameras";
import Ship from "./Ship";
import { DesktopShipControls } from "./controls/DesktopShipControls";
import DesktopGameControls from "./controls/DesktopGameControls";
import FirstPersonShip from "./FirstPersonShip";
import Bot from "./Bot";

export default class Game extends Scene{

    public ship:FirstPersonShip = new FirstPersonShip(new PerspectiveCamera(60, window.innerWidth / window.innerHeight));
    public enemies:Bot[] = [];
    public renderer = new WebGLRenderer({ antialias: true, canvas:document.getElementById('mainCanvas') });
    public auxRenderer = new WebGLRenderer({
        canvas:document.getElementById('auxCanvas'),
        antialias:false,
    });

    public controls = new DesktopShipControls(this.ship, this.renderer.domElement);
    public gameControls = new DesktopGameControls(this);
    public cameras:PerspectiveCamera[] = Cameras;
    private showingCamera:PerspectiveCamera = this.cameras[0];
    private _ships:Ship[] = [];
    public get ships() : Ship[] {return this._ships};

    constructor(height:number, width:number) {

        super();

        // Determinando dimensões do renderer principal
        this.setSize(height, width);

        // Adicionando Iluminação
        this.add(...Lights);

        // Adicionando Nave
        this.ship.position.x = 2;
        this.ship.position.y = 0;
        this.ship.position.z = 0;
        this.ship.rotateX(-0.3)
        this.ship.rotateY(Math.PI)
        this.addShip(this.ship);

        // Adicionando bots aleatoriamente
        for (let i = 0; i < 5; i++) {
            this.addBotRandomly()
        }

        // Configurando renderizadores
        this.auxRenderer.setClearColor(0x333333, 0.5)

        // Extras
        // this.addSpiningCube();
        this.drawAxis(5);
        // this.drawGrid(100,1);

        // Renderizando continuamente
        this.renderContinuous();
    }

    public setSize(height: number, width: number) {
        this.renderer.setSize(width, height);
    }

    public addBotRandomly(){
        
        let bot = new Bot(this)
        bot.ship.position.set(random(20), random(20), random(20));
        this.enemies.push(bot);
        this.addShip(bot.ship);

        function random(max:number){
            return Math.round(2*max*(Math.random() - 0.5));
        }
        
    }

    public addShip(ship:Ship){
        this.add(ship);
        this._ships.push(ship);
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

        let arrowSize:number = 1;

        this.drawLine(0x0000FF,new Vector3( -size, 0, 0 ), new Vector3( size, 0, 0 ),new Vector3( size, 0, arrowSize),new Vector3( size + 2*arrowSize, 0, 0 ),new Vector3( size, 0, -arrowSize),new Vector3( size, 0, 0 ));
        this.drawLine(0x00FF00,new Vector3( 0, -size, 0 ), new Vector3( 0, size, 0 ),new Vector3( arrowSize, size, 0),new Vector3( 0, size + 2*arrowSize, 0 ),new Vector3( -arrowSize, size, 0),new Vector3( 0, size, 0 ));
        this.drawLine(0xFF0000,new Vector3( 0, 0, -size ), new Vector3( 0, 0, size ),new Vector3( arrowSize, 0, size),new Vector3( 0, 0, size + 2*arrowSize ),new Vector3( -arrowSize, 0, size),new Vector3( 0, 0, size ));
        
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
        this.renderer.render(this, this.ship.camera);
        this.auxRenderer.render(this, this.showingCamera);
    }

    switchNextCamera() {
        let pos = this.cameras.indexOf(this.showingCamera);
        if(pos == this.cameras.length - 1){
            this.showingCamera = this.cameras[0]
        } else {
            this.showingCamera = this.cameras[pos + 1];
        }
    }
    
    switchToPreviousCamera() {
        let pos = this.cameras.indexOf(this.showingCamera);
        if(pos == 0){
            this.showingCamera = this.cameras[this.cameras.length - 1]
        } else {
            this.showingCamera = this.cameras[pos - 1];
        }
    }
}