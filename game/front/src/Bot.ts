import Game from "./Game";
import Ship from "./Ship";

export default class Bot {

    private _ship: Ship;

    constructor(
        private _game: Game,
    ) {
        this._ship = new Ship();
        this._game.add(this._ship);
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

    public get ship() {
        return this._ship;
    }

}