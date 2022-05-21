import Game from "../Game/Game";
import Ship from "../Ship/Ship";

export default class Player {

    protected _ship: Ship;
    public get ship() {return this._ship;}

    private _enemies: Player[];
    public get enemies(): Player[] {return this._enemies;}

    private _friends: Player[];
    public get friends(): Player[] {return this._friends;}
    
    constructor(
        private _game: Game
    ) {
        this._ship = new Ship();
        this._game.add(this._ship);
    }

    addEnemies(...players:Player[]){
        this._enemies.push(...players);
    }

    addFriends(...players:Player[]){
        this._friends.push(...players);
    }

}