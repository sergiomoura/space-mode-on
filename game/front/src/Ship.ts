import {
    BoxGeometry,
    Group,
    PerspectiveCamera,
    MeshPhongMaterial,
    Mesh,
    Vector3,
    Euler
} from "three";
import DashPill from "./DashPill";

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

    private fwAcceleration:number = 0;
    private bwAcceleration:number = 0;
    private rAcceleration:number = 0;
    private lAcceleration:number = 0;

    private fwDeacceleration:number = 0;
    private bwDeacceleration:number = 0;
    private rDeacceleration:number = 0;
    private lDeacceleration:number = 0;
    
    private fwMaxSpeed:number;
    private bwMaxSpeed:number;
    private rMaxSpeed:number;
    private lMaxSpeed:number;

    private defaults = {
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
        pointingSpeed: 1
    }

    private _dashing: boolean;
    private _dashPills:DashPill[] = [
        new DashPill(5000, 1, 0.1),
        new DashPill(5000, 1, 0.1),
        new DashPill(5000, 1, 0.1),
        new DashPill(5000, 1, 0.1)
    ]

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
        this.hitBoxMesh.rotateX(0.05);

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

        // Determinando valores padrão
        this.fwMaxSpeed = this.defaults.fwMaxSpeed;
        this.bwMaxSpeed = this.defaults.bwMaxSpeed;
        this.rMaxSpeed = this.defaults.rMaxSpeed;
        this.lMaxSpeed = this.defaults.lMaxSpeed;

    }

    private move(){

        // Atualizando velocidade com aceleração
        if(this.fwSpeed < this.fwMaxSpeed){this.fwSpeed += this.fwAcceleration}
        if(this.bwSpeed < this.bwMaxSpeed){this.bwSpeed += this.bwAcceleration}
        if(this.rSpeed < this.rMaxSpeed){this.rSpeed += this.rAcceleration}
        if(this.lSpeed < this.lMaxSpeed){this.lSpeed += this.lAcceleration}

        if(this.fwSpeed > 0){this.fwSpeed -= this.fwDeacceleration}
        if(this.bwSpeed > 0){this.bwSpeed -= this.bwDeacceleration}
        if(this.rSpeed > 0){this.rSpeed -= this.rDeacceleration}
        if(this.lSpeed > 0){this.lSpeed -= this.lDeacceleration}

        // Atualizando posição com velocidade
        this.translateOnAxis(this.direction, this.fwSpeed);
        this.translateOnAxis(this.oposite, this.bwSpeed);
        this.translateOnAxis(this.right, this.rSpeed);
        this.translateOnAxis(this.left, this.lSpeed);
        
        requestAnimationFrame(()=>{this.move()});
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

    public get dashing() : boolean {
        return this._dashing;
    }
    
    startMovingForward() {
        if(!this._dashing){
            this.fwAcceleration = this.defaults.fwAcceleration;
            this.fwDeacceleration = 0;
        }
    }

    stopMovingForward(){
        if(!this._dashing){
            this.fwDeacceleration = this.defaults.fwDeacceleration;
            this.fwAcceleration = 0; 
        }
    }

    startMovingBackwards() {
        if(!this._dashing){
            this.bwAcceleration = this.defaults.bwAcceleration;
            this.bwDeacceleration = 0;
        }
    }

    stopMovingBackwards() {
        if(!this._dashing){
            this.bwDeacceleration = this.defaults.bwDeacceleration;
            this.bwAcceleration = 0; 
        }
    }

    startMovingRight() {
        this.rAcceleration = this.defaults.rAcceleration;
        this.rDeacceleration = 0;
    }

    stopMovingRight(){
        this.rDeacceleration = this.defaults.rDeacceleration;
        this.rAcceleration = 0; 
    }

    startMovingLeft() {
        this.lAcceleration = this.defaults.lAcceleration;
        this.lDeacceleration = 0;
    }

    stopMovingLeft(){
        this.lDeacceleration = this.defaults.lDeacceleration;
        this.lAcceleration = 0; 
    }

    dash(){

        if(!this._dashing && this._dashPills.length > 0){

            let dashPill = this._dashPills.pop();
            this._dashing = true;
            
            // Determinando a nova velocidade máxima
            this.fwMaxSpeed = dashPill.speed;

            // Determinando a nova aceleração
            this.fwAcceleration = dashPill.acceleration;
            this.fwDeacceleration = 0;

            // Determinandoa hora de parar o dash
            setTimeout(() => {
                this.undash()
            }, dashPill.duration);
        }
    }

    undash(){

        // Marcando a flag para false
        this._dashing = false;

        // Retornando a velocidade normal
        this.fwMaxSpeed = this.defaults.fwMaxSpeed;

        // Setando a aceleração para 0 e desaceleração para valor padrão
        this.fwAcceleration = 0
        this.fwDeacceleration = this.defaults.fwDeacceleration;
    }

    pointTo(x:number, y:number){
        _euler.setFromQuaternion( this.quaternion );

		_euler.y -= x * 0.002 * this.defaults.pointingSpeed;
		_euler.x -= y * 0.002 * this.defaults.pointingSpeed;
		_euler.x = Math.max( _PI_2 - this.defaults.maxPolarAngle, Math.min( _PI_2 - this.defaults.minPolarAngle, _euler.x ) );

		this.quaternion.setFromEuler( _euler );
    }

}