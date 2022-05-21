import Ship from "../Ship/Ship";

export default abstract class Player {

    protected _ship: Ship;
    public get ship() {return this._ship;}
    public set ship(s:Ship){
        this._ship = s
        s.player = this;
    }

    private _enemies: Player[] = [];
    public get enemies(): Player[] {return this._enemies;}

    private _friends: Player[] = [];
    public get friends(): Player[] {return this._friends;}
    
    private _name:string;
    public get name():string{return this._name} 

    constructor(name:string) {
        this._name = name;
    }

    addEnemies(...players:Player[]){
        this._enemies.push(...players);
    }

    addFriends(...players:Player[]){
        this._friends.push(...players);
    }

}