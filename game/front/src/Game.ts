import {
    Camera,
    BoxGeometry,
    MeshPhongMaterial,
    Mesh,
    PerspectiveCamera,
    WebGLRenderer,
    Scene,
    MeshBasicMaterial,
    LineBasicMaterial,
    Vector3,
    BufferGeometry,
    Line,
    LineDashedMaterial
} from "three";
import Lights from "./Lights";
import Controls from "./Controls";
import Ship from "./Ship";
import MovingCamera from "./MovingCamera";

export default class Game {

    public scene = new Scene();
    public ship:Ship = new Ship(new PerspectiveCamera(60, window.innerWidth / window.innerHeight));
    private camera: MovingCamera = new MovingCamera(60, window.innerWidth / window.innerHeight);
    public renderer = new WebGLRenderer({ antialias: true });
    public controls = new Controls(this.ship, this.renderer.domElement);

    constructor(height:number, width:number) {
        this.setSize(height, width);
        this.scene.add(...Lights);
        this.scene.add(this.ship);
        this.ship.position.z = 10;
        this.camera.position.x = 1;
        this.camera.position.y = 1;
        this.camera.position.z = 3;
        this.camera.lookAt(0,0,0)
    }

    public setSize(height: number, width: number) {
        this.renderer.setSize(width, height);
    }

    public demo() {
        // Temp
        const geometry = new BoxGeometry(0.1, 0.1, 0.1);
        const material = new MeshPhongMaterial({ color: 0x00ff00 });
        material.opacity = 0.5;
        material.transparent = true;
        const cube = new Mesh(geometry, material);
        
        cube.castShadow = true;
        cube.receiveShadow = true;
        this.scene.add(cube);
        
        this.renderer.render(this.scene, this.ship.camera);

        const animate = () => {
            requestAnimationFrame(animate);

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.02;
            cube.rotation.z += 0.01;

            this.renderer.render(this.scene, this.ship.camera);
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
}