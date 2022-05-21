import Game from "../Game/Game";
import Player from "../Player/Player";

export default class Bot extends Player{
    
    constructor(
        _game: Game,
    ) {
        super(_game);
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