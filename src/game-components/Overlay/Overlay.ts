import GameEvents from "../../lib/GameEvents";
import Game from "../Game/Game";
import { ShipEvents } from "../Ship/ShipEvents";

export class Overlay extends EventTarget {
  
  public static readonly SUBMIT: string = 'submit';
  
  constructor (
    private readonly healthBar: HTMLDivElement,
    private readonly dashBar: HTMLDivElement,
  ) {
    
    super();
  
  }
  
  public connect (game: Game): void {
    
    game.addEventListener(
        GameEvents.MAIN_PLAYER_HEALTH_CHANGED
        , (evt) => {
          this.setNewHealth(evt.newHealthPecents);
        }
    );

    game.mainPlayer.ship.addEventListener(ShipEvents.SHIP_STARTED_DASH, (evt) => {
      this.onStartDash(evt.duration, evt.cooldown);
    })
  }

  setNewHealth (newHealthPecents: number): void {
    this.healthBar.style.height = newHealthPecents + '%';
  }

  onStartDash (duration: number, cooldown: number): void {
    this.dashBar.parentElement!.style.opacity = '0.8';
    this.dashBar.style.transition = `height ${duration}ms linear`;
    this.dashBar.style.height = '0%';

    setTimeout(() => {
      this.dashBar.style.transition = `height ${cooldown}ms linear`;
      this.dashBar.style.height = '100%';
      this.dashBar.parentElement!.style.opacity = '1';
    }, duration);
  }
}