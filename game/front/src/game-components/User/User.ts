import { PerspectiveCamera } from "three";
import FirstPersonShip from "../FirstPersonShip/FirstPersonShip";
import Player from "../Player/Player";

export default class User extends Player{
    constructor(name:string){
        super(name);
        this.ship = new FirstPersonShip(new PerspectiveCamera(60, window.innerWidth / window.innerHeight));
        // this.ship.drawDirection()
    }
}