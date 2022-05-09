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
} from "three";
import Lights from "./Lights";
import Cameras from "./Cameras";
import Ship from "./Ship";
import { DesktopShipControls } from "./DesktopShipControls";
import DesktopGameControls from "./DesktopGameControls";

export default class Game {

    public scene = new Scene();
    public ship:Ship = new Ship(new PerspectiveCamera(60, window.innerWidth / window.innerHeight));
    public renderer = new WebGLRenderer({ antialias: true });
    public controls = new DesktopShipControls(this.ship, this.renderer.domElement);
    public gameControls = new DesktopGameControls(this);
    public cameras:PerspectiveCamera[] = [
        this.ship.camera,
        ...Cameras   
    ]
    private showingCamera:PerspectiveCamera = this.cameras[0];
    

    constructor(height:number, width:number) {
        this.setSize(height, width);
        this.scene.add(...Lights);
        this.scene.add(this.ship);
        this.ship.position.z = 15;
        this.addSpiningCube();
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

        const blueMaterial = new LineBasicMaterial( { color: 0x0000FF } );
        const greenMaterial = new LineBasicMaterial( { color: 0x006600 } );
        const redMaterial = new LineBasicMaterial( { color: 0xFF0000 } );
        
        let geometry:BufferGeometry;
        let line:Line;
        let points:Vector3[];

        points = [new Vector3( - 10, 0, 0 ), new Vector3( 10, 0, 0 )];
        geometry = new BufferGeometry().setFromPoints(points);
        line = new Line( geometry, blueMaterial );
        this.scene.add(line);

        points = [new Vector3( 0, -10, 0 ), new Vector3( 0, 10, 0 )];
        geometry = new BufferGeometry().setFromPoints(points);
        line = new Line( geometry, greenMaterial );
        this.scene.add(line);

        points = [new Vector3( 0, 0, -10 ), new Vector3( 0, 0, 10 )];
        geometry = new BufferGeometry().setFromPoints(points);
        line = new Line( geometry, redMaterial );

        this.scene.add(line);
        
    }

    public renderContinuous(){
        requestAnimationFrame(()=>{this.renderContinuous()});
        this.renderer.render(this.scene, this.showingCamera)
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