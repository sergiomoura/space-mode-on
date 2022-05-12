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

    private fwAcceleration:number = 0.004;
    private bwAcceleration:number = 0.004;
    private rAcceleration:number = 0.004;
    private lAcceleration:number = 0.004;

	private minPolarAngle:number = 0;
	private maxPolarAngle:number = Math.PI;
    private pointerSpeed:number = 1;

    private fwAnimatrionFrameId:number;
    private bwAnimatrionFrameId:number;
    private rAnimatrionFrameId:number;
    private lAnimatrionFrameId:number;

    private fwMaxSpeed = 0.08;
    private bwMaxSpeed = 0.08;
    private rMaxSpeed = 0.08;
    private lMaxSpeed = 0.08;

    private _dashing: boolean;

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

    private move(){
        requestAnimationFrame(()=>{this.move()});
        
        this.translateOnAxis(this.direction, this.fwSpeed);
        this.translateOnAxis(this.oposite, this.bwSpeed);
        this.translateOnAxis(this.right, this.rSpeed);
        this.translateOnAxis(this.left, this.lSpeed);
    }

    private fwAccelerate(maxSpeed:number){
        cancelAnimationFrame(this.fwAnimatrionFrameId);
        this.fwAnimatrionFrameId = requestAnimationFrame(()=>{this.fwAccelerate(maxSpeed)});
        if(this.fwSpeed < maxSpeed){this.fwSpeed += (this.fwMaxSpeed - this.fwSpeed)/2}
    }

    private fwBreak(){
        cancelAnimationFrame(this.fwAnimatrionFrameId);
        this.fwAnimatrionFrameId = requestAnimationFrame(()=>{this.fwBreak()});
        if(this.fwSpeed > 0){this.fwSpeed -= this.fwAcceleration}
    }

    private bwAccelerate(maxSpeed:number){
        cancelAnimationFrame(this.bwAnimatrionFrameId);
        this.bwAnimatrionFrameId = requestAnimationFrame(()=>{this.bwAccelerate(maxSpeed)});
        if(this.bwSpeed < maxSpeed){this.bwSpeed += this.bwAcceleration}
    }

    private bwBreak(){
        cancelAnimationFrame(this.bwAnimatrionFrameId);
        this.bwAnimatrionFrameId = requestAnimationFrame(()=>{this.bwBreak()});
        if(this.bwSpeed > 0){this.bwSpeed -= this.bwAcceleration}
    }

    private rAccelerate(maxSpeed:number){
        cancelAnimationFrame(this.rAnimatrionFrameId);
        this.rAnimatrionFrameId = requestAnimationFrame(()=>{this.rAccelerate(maxSpeed)});
        if(this.rSpeed < maxSpeed){this.rSpeed += this.rAcceleration}
    }

    private rBreak(){
        cancelAnimationFrame(this.rAnimatrionFrameId);
        this.rAnimatrionFrameId = requestAnimationFrame(()=>{this.rBreak()});
        if(this.rSpeed > 0){this.rSpeed -= this.rAcceleration}
    }

    private lAccelerate(maxSpeed:number){
        cancelAnimationFrame(this.lAnimatrionFrameId);
        this.lAnimatrionFrameId = requestAnimationFrame(()=>{this.lAccelerate(maxSpeed)});
        if(this.lSpeed < maxSpeed){this.lSpeed += this.lAcceleration}
    }

    private lBreak(){
        cancelAnimationFrame(this.lAnimatrionFrameId);
        this.lAnimatrionFrameId = requestAnimationFrame(()=>{this.lBreak()});
        if(this.lSpeed > 0){this.lSpeed -= this.lAcceleration}
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
        this.fwAccelerate(this.fwMaxSpeed);
    }

    stopMovingForward(){
        if(!this._dashing){
            this.fwBreak();
        }
    }

    startMovingBackwards() {
        this.bwAccelerate(this.bwMaxSpeed);
    }

    stopMovingBackwards() {
        this.bwBreak()
    }

    startMovingRight() {
        this.rAccelerate(this.rMaxSpeed);
    }

    stopMovingRight(){
        this.rBreak();
    }

    startMovingLeft() {
        this.lAccelerate(this.lMaxSpeed)
    }

    stopMovingLeft(){
        this.lBreak();
    }

    dash(){
        console.log('dashing...');
        this._dashing = true;
        setTimeout(() => {
            this.undash()
        }, 5000);
    }

    undash(){
        this._dashing = false;
        console.log('undashing...')
    }

    pointTo(x:number, y:number){
        _euler.setFromQuaternion( this.quaternion );

		_euler.y -= x * 0.002 * this.pointerSpeed;
		_euler.x -= y * 0.002 * this.pointerSpeed;

		_euler.x = Math.max( _PI_2 - this.maxPolarAngle, Math.min( _PI_2 - this.minPolarAngle, _euler.x ) );

		this.quaternion.setFromEuler( _euler );
    }

}