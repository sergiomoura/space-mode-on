import GameEvents from "../../lib/GameEvents";
import Game from "../Game/Game";

export class Overlay extends EventTarget {
  
  public static readonly SUBMIT: string = 'submit';
  
  constructor (
    private readonly divOverlay: HTMLDivElement,
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
  }

  setNewHealth (newHealthPecents: number): void {
    const healthBar = <HTMLDivElement>document.getElementById('health-bar');
    healthBar.style.height = newHealthPecents + '%';
  }
}