import { BoxGeometry, MeshBasicMaterial, Mesh, Vector3, Group, Event } from "three";
import Ship from "./Ship";

export default class Shot extends Group{
    
    private _hitbox: BoxGeometry = new BoxGeometry(0.1, 0.1 , 1.1);
    private _hitboxMesh: Mesh;
    private _direction: Vector3;
    private _speed: number;
    private _remainingDistance: number;
    private _animationFrameId: number;

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
        } else {
            cancelAnimationFrame(this._animationFrameId);
            this.removeFromParent();
        }
        
    }

    
}