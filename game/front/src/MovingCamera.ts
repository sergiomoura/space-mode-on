import { PerspectiveCamera, Vector3 } from "three";

export default class MovingCamera extends PerspectiveCamera{
    
    private direction:Vector3 = new Vector3(0,0,0);
    private oposite:Vector3 = new Vector3(0,0,0);
    private right:Vector3 = new Vector3(0,0,0);
    private left:Vector3 =  new Vector3(0,0,0);

    private fwSpeed:number = 0;
    private bwSpeed:number = 0;
    private rSpeed:number = 0;
    private lSpeed:number = 0;

    private forwardIntervalId:NodeJS.Timeout;
    private backwardIntervalId:NodeJS.Timeout;
    private rightIntervalId: NodeJS.Timeout;
    private leftIntervalId: NodeJS.Timeout;

    private readonly maxSpeed = 0.008;

    constructor(
        fov?: number,
        aspect?: number,
        near?: number,
        far?:number
    ){
        // Chamando o contrutor pai
        super(fov, aspect, near, far);

        // Determinando o vetor da direção da câmera
        this.getWorldDirection(this.direction);

        // Determinando o vetor oposto à direção da câmera
        this.oposite = this.direction.clone().multiplyScalar(-1);
        
        // Determinando o vetor da posição;
        this.getWorldPosition(this.position);

        // Determinando vetor para a direita
        this.right = this.localToWorld(new Vector3(1,0,0)).sub(this.position);

        // Determinando o vetor para a esquerda;
        this.left = this.right.clone().multiplyScalar(-1);

    }

    startMovingForward() {
        if(this.fwSpeed == 0){
            this.fwSpeed = this.maxSpeed;
            this.moveForward()
            this.forwardIntervalId = setInterval(
                ()=>{this.moveForward()}
                ,10
            )
        }
    }

    stopMovingForward(){
        this.fwSpeed = 0;
        clearInterval(this.forwardIntervalId);
    }

    startMovingBackwards() {
        if(this.bwSpeed == 0){
            this.bwSpeed = this.maxSpeed;
            this.moveBackwards()
            this.backwardIntervalId = setInterval(
                ()=>{this.moveBackwards()}
                ,10
            )
        }
    }

    stopMovingBackwards() {
        this.bwSpeed = 0;
        clearInterval(this.backwardIntervalId);
    }

    startMovingRight() {
        if(this.rSpeed == 0){
            this.rSpeed = this.maxSpeed;
            this.moveRight()
            this.rightIntervalId = setInterval(
                ()=>{this.moveRight()}
                ,10
            )
        }
    }

    stopMovingRight(){
        this.rSpeed = 0;
        clearInterval(this.rightIntervalId);
    }

    startMovingLeft() {
        if(this.lSpeed == 0){
            this.lSpeed = this.maxSpeed;
            this.moveLeft();
            this.leftIntervalId = setInterval(
                ()=>{this.moveLeft()}
                ,10
            )
        }
    }

    stopMovingLeft(){
        this.lSpeed = 0;
        clearInterval(this.leftIntervalId);
    }

    private moveForward(){
        this.translateOnAxis(this.direction, this.fwSpeed);
    }

    private moveBackwards(){
        this.translateOnAxis(this.oposite, this.bwSpeed);
    }

    private moveRight(){
        this.translateOnAxis(this.right, this.rSpeed);
    }

    private moveLeft(){
        this.translateOnAxis(this.left, this.lSpeed);
    }

    
}