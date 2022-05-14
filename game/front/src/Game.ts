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

export default class Game {

    public scene = new Scene();
    public ship:FirstPersonShip = new FirstPersonShip(new PerspectiveCamera(60, window.innerWidth / window.innerHeight));
    public renderer = new WebGLRenderer({ antialias: true, canvas:document.getElementById('mainCanvas') });
    public auxRenderer = new WebGLRenderer({
        canvas:document.getElementById('auxCanvas'),
        antialias:false,
    });

    public controls = new DesktopShipControls(this.ship, this.renderer.domElement);
    public gameControls = new DesktopGameControls(this);
    public cameras:PerspectiveCamera[] = Cameras;
    private showingCamera:PerspectiveCamera = this.cameras[0];
    

    constructor(height:number, width:number) {
        // Determinando dimensões do renderer principal
        this.setSize(height, width);

        // Adicionando Iluminação
        this.scene.add(...Lights);

        // Adicionando Nave
        this.scene.add(this.ship);
        this.ship.position.x = 5;
        this.ship.position.y = 5;
        this.ship.position.z = 10;
        this.ship.rotateX(-0.3)
        this.ship.rotateY(0.3)

        // Configurando renderizadores
        this.auxRenderer.setClearColor(0x333333,0.5)

        // Extras
        this.addSpiningCube();
        // this.drawAxis();
        this.drawGrid(100,1);

        // Renderizando continuamente
        this.renderContinuous();
    }

    public setSize(height: number, width: number) {
        this.renderer.setSize(width, height);
    }

    public addSpiningCube() {

        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshPhongMaterial({ color: 0x00ff00 });
        material.opacity = 0.5;
        material.transparent = true;
        const cube = new Mesh(geometry, material);
        
        cube.castShadow = true;
        cube.receiveShadow = true;
        this.scene.add(cube);

        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.03;
            cube.rotation.y += 0.06;
            cube.rotation.z += 0.03;
        };

        animate();
    }

    public drawAxis(){

        this.drawLine(0x0000FF,new Vector3( - 10, 0, 0 ), new Vector3( 10, 0, 0 ));
        this.drawLine(0x00FF00,new Vector3( 0, -10, 0 ), new Vector3( 0, 10, 0 ));
        this.drawLine(0xFF0000,new Vector3( 0, 0, -10 ), new Vector3( 0, 0, 10 ));
        
    }

    public drawLine(color:ColorRepresentation, start:Vector3, end:Vector3){
        const material = new LineBasicMaterial( { color } );
        
        let geometry:BufferGeometry;
        let line:Line;
        let points:Vector3[] = [start, end];

        
        geometry = new BufferGeometry().setFromPoints(points);
        line = new Line( geometry, material );
        this.scene.add(line);

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
        this.renderer.render(this.scene, this.ship.camera);
        this.auxRenderer.render(this.scene, this.showingCamera);
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