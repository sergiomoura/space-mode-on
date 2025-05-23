import { Object3DEventMap } from "three";
import Ship from "../game-components/Ship/Ship";

enum GameEvents {
    
  SHIP_GOT_DAMAGE = 'shipGotDamaged',
  SHIP_DESTROYED = 'shipDestroyed',
  MAIN_PLAYER_DIED = 'mainPlayerDied',
  MAIN_PLAYER_WON = 'mainPlayerWon',
  MAIN_PLAYER_HEALTH_CHANGED = 'mainPlayerHealthChanged',

}

export interface GameEventsMap extends Object3DEventMap {
  [GameEvents.SHIP_GOT_DAMAGE]: {ship: Ship, damage: number};
  [GameEvents.SHIP_DESTROYED]: {ship: Ship};
  [GameEvents.MAIN_PLAYER_DIED]: {};
  [GameEvents.MAIN_PLAYER_WON]: {};
  [GameEvents.MAIN_PLAYER_HEALTH_CHANGED]: {newHealthPecents: number};
}

export default GameEvents;
