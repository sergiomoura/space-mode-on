import { BoxGeometry, MeshBasicMaterial, Mesh, Vector3, Group, Event, Ray, Raycaster } from "three";
import Ship from "./Ship";
import Game from "./Game";
import Damageble from "./Damageble";

export default class Shot extends Group{
    
    private _hitbox: BoxGeometry = new BoxGeometry(0.1, 0.1 , 1.1);
    private _hitboxMesh: Mesh;
    private _direction: Vector3;
    private _speed: number;
    private _remainingDistance: number;
    private _animationFrameId: number;
    private _raycaster:Raycaster;
    private _intersectables:Ship[];
    private _origin:Vector3;
    private _worldDirection:Vector3;

    public get hitbox(): BoxGeometry {
        return this._hitbox;
    }

    constructor(
        private _velocity:Vector3,
        private _demage:number,
        private _reach:number,
        private _owner:Ship
    ){
        super();
        this.drawHitBox();
        this._direction = this._velocity.clone().normalize();
        this._speed = this._velocity.length();
        this._remainingDistance = _reach;
        this._intersectables = (<Game>(this._owner.parent)).enemyShips;
        _owner.addEventListener(
            'shoot',
            ()=>{
                this._origin = _owner.position.clone();
                this._worldDirection = this._direction.clone().applyMatrix4(_owner.matrixWorld).sub(_owner.position);
            }
        );
        this.move();
    }

    drawHitBox(){
        const material = new MeshBasicMaterial({ color: 0xff0000 });
        this._hitboxMesh = new Mesh(this.hitbox, material);
        this.add(this._hitboxMesh);
    }

    move(){

        this._animationFrameId = requestAnimationFrame(()=>{this.move()});
        if(this._remainingDistance > 0){
            this.translateOnAxis(this._direction, this._speed);
            this._remainingDistance -= this._speed;
            this.checkHit();

        } else {
            cancelAnimationFrame(this._animationFrameId);
            this.removeFromParent();
        }
        
    }

    private checkHit(){
        if(this.parent != null){

            let origin:Vector3 = this.position.clone();

            let rc:Raycaster = new Raycaster(origin, this._worldDirection);
            let intersections = rc.intersectObjects(this._intersectables, true);
            
            if(intersections.length > 0){
                if(intersections[0].distance < this._velocity.length()){
                    // Adicionando spinningCube no ponto de colisão
                    let fi = intersections[0].point;
                    (<Game>(this._owner.parent)).addSpiningCube(fi.x, fi.y, fi.z)
                    
                    // Capturando nave na trajetória do tiro
                    let damageble:Damageble = <Damageble>(<unknown>(intersections[0].object.parent));
                    damageble.getDemage(this._demage);

                }
            }

        }
    }
    
}