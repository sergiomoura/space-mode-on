export default class DashPill {
    constructor(
        private _duration: number,
        private _speed: number,
        private _acceleration: number
    ){}
    public get speed(): number {
        return this._speed;
    }
    public get duration(): number {
        return this._duration;
    }
    
    public get acceleration() : number {
        return this._acceleration;
    }
    
    
}