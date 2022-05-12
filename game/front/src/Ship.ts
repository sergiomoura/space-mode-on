import {
    BoxGeometry,
    Group,
    PerspectiveCamera,
    MeshPhongMaterial,
    Mesh,
    Vector3,
    Euler
} from "three";

const _euler = new Euler( 0, 0, 0, 'YXZ' );
const _PI_2 = Math.PI / 2;

export default class Ship extends Group{
    
    private _camera:PerspectiveCamera;
    private hitBox:BoxGeometry;
    private hitBoxMesh:Mesh;

    private direction:Vector3 = new Vector3(0,0,0);
    private oposite:Vector3 = new Vector3(0,0,0);
    private right:Vector3 = new Vector3(0,0,0);
    private left:Vector3 =  new Vector3(0,0,0);

    private fwSpeed:number = 0;
    private bwSpeed:number = 0;
    private rSpeed:number = 0;
    private lSpeed:number = 0;
	private minPolarAngle:number = 0;
	private maxPolarAngle:number = Math.PI;
    private pointerSpeed:number = 1;

    private readonly maxSpeed = 0.03;

    private move(){
        requestAnimationFrame(()=>{this.move()});
        
        this.translateOnAxis(this.direction, this.fwSpeed);
        this.translateOnAxis(this.oposite, this.bwSpeed);
        this.translateOnAxis(this.right, this.rSpeed);
        this.translateOnAxis(this.left, this.lSpeed);
    }

    constructor(camera:PerspectiveCamera){
        // Chamando contrutor do pai
        super();

        // Iniciando movimento perpétuo
        this.move();

        // Definindo e desenhando hitBox
        this.hitBox = new BoxGeometry(1,1,2);
        this.drawHitBox();
        this.hitBoxMesh.position.z = -7;
        this.hitBoxMesh.position.y = -2;
        this.hitBoxMesh.rotateX(0.05)

        // Definindo camera
        this._camera = camera;

        // Adicionando câmera e hitBox
        this.add(this.hitBoxMesh);
        this.add(this._camera);

        // Determinando o vetor da direção da câmera
        this.getWorldDirection(this.direction).multiplyScalar(-1);

        // Determinando o vetor oposto à direção da câmera
        this.oposite = this.direction.clone().multiplyScalar(-1);
        
        // Determinando o vetor da posição;
        this.getWorldPosition(this.position);

        // Determinando vetor para a direita
        this.right = this.localToWorld(new Vector3(1,0,0)).sub(this.position);

        // Determinando o vetor para a esquerda;
        this.left = this.right.clone().multiplyScalar(-1);
    }

    drawHitBox(){
        const material = new MeshPhongMaterial({ color: 0xf0f0f0 });
        material.opacity = 0.5;
        material.transparent = true;
        this.hitBoxMesh = new Mesh(this.hitBox, material);
        
        this.hitBoxMesh.castShadow = true;
        this.hitBoxMesh.receiveShadow = true;
    }
    
    public get camera() : PerspectiveCamera {
        return this._camera;
    }
    
    startMovingForward() {
        this.fwSpeed = this.maxSpeed;
    }

    stopMovingForward(){
        this.fwSpeed = 0;
    }

    startMovingBackwards() {
        this.bwSpeed = this.maxSpeed;
    }

    stopMovingBackwards() {
        this.bwSpeed = 0;
    }

    startMovingRight() {
        this.rSpeed = this.maxSpeed;
    }

    stopMovingRight(){
        this.rSpeed = 0;
    }

    startMovingLeft() {
        this.lSpeed = this.maxSpeed;
    }

    stopMovingLeft(){
        this.lSpeed = 0;
    }

    pointTo(x:number, y:number){
        _euler.setFromQuaternion( this.quaternion );

		_euler.y -= x * 0.002 * this.pointerSpeed;
		_euler.x -= y * 0.002 * this.pointerSpeed;

		_euler.x = Math.max( _PI_2 - this.maxPolarAngle, Math.min( _PI_2 - this.minPolarAngle, _euler.x ) );

		this.quaternion.setFromEuler( _euler );
    }


}