import { ColorRepresentation } from "three";
import Player from "../Player/Player";
import Ship from "../Ship/Ship";

export default class Bot extends Player{
    
    constructor(color: ColorRepresentation) {
        super(`BOT-${Math.round(Math.random()*10000)}`);
        this.ship = new Ship(color);
        this.move();
    }

    private move() {
        requestAnimationFrame(() => this.move());

        let random = (max: number) => {
            return Math.round(2 * max * (Math.random() - 0.5));
        }

        this._ship.pointTo(random(100), random(100));
        this._ship.startMovingForward();
    }

}