export default class DashPill {

  constructor (
    private readonly _duration: number,
    private readonly _speed: number,
    private readonly _acceleration: number
  ) {}

  public get speed (): number {

    return this._speed;
  
  }

  public get duration (): number {

    return this._duration;
  
  }

  public get acceleration (): number {

    return this._acceleration;
  
  }

}
