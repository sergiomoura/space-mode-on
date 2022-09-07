import { Subscription } from 'rxjs';
import {
  Vector3
} from 'three';
import Bot from '../game-components/Bot/Bot';
import Game from '../game-components/Game/Game';
import Ship from '../game-components/Ship/Ship';
import { PressedKeys, ObservableKeyboard } from '../lib/ObservableKeyboard';
import { Controls } from './Controls';

const _vector = new Vector3();

enum ControlKeys {
  w = 'KeyW',
  s = 'KeyS',
  a = 'KeyA',
  d = 'KeyD',
  q = 'KeyQ',
  space = 'Space'
}

class DesktopShipControls implements Controls {

  private readonly gameElement: HTMLElement;
  private readonly ship: Ship;
  private isLocked: boolean;
  private keyboarSubscription: Subscription;

  constructor (game: Game, gameElement: HTMLElement) {
    
    this.ship = game.mainPlayer.ship;
    this.gameElement = gameElement;
    this.isLocked = false;

  }

  private readonly onMouseMove = (evt: MouseEvent): void => {

    if (!this.isLocked) return;
    this.ship.pointTo(evt.movementX, evt.movementY);
  
  };

  private readonly onMouseClick = (_evt: MouseEvent): void => {

    if (this.isLocked) {

      this.ship.shoot();
    
    }
  
  };

  private readonly onPointerlockChange = (): void => {

    if (this.gameElement.ownerDocument.pointerLockElement === this.gameElement) {

      this.isLocked = true;
    
    } else {

      this.isLocked = false;
    
    }
  
  };

  private readonly onPointerlockError = (): void => {

    console.error('THREE.PointerLockControls: Unable to use Pointer Lock API');
  
  };

  connect (): void {
    
    this.keyboarSubscription = ObservableKeyboard.subscribe((pressedKeys: PressedKeys) => { this.commandShip(pressedKeys); });
    this.gameElement.ownerDocument.addEventListener('mousemove', this.onMouseMove);
    this.gameElement.ownerDocument.addEventListener('click', this.onMouseClick);
    this.gameElement.ownerDocument.addEventListener('pointerlockchange', this.onPointerlockChange);
    this.gameElement.ownerDocument.addEventListener('pointerlockerror', this.onPointerlockError);
    this.lock();
  
  }

  disconnect (): void {

    this.keyboarSubscription.unsubscribe();
    this.gameElement.ownerDocument.removeEventListener('mousemove', this.onMouseMove);
    this.gameElement.ownerDocument.removeEventListener('click', this.onMouseClick);
    this.gameElement.ownerDocument.removeEventListener('pointerlockchange', this.onPointerlockChange);
    this.gameElement.ownerDocument.removeEventListener('pointerlockerror', this.onPointerlockError);
    this.unlock();
  
  };

  dispose (): void {

    this.disconnect();
  
  };

  getDirection (): (v: Vector3) => Vector3 {

    const direction = new Vector3(0, 0, -1);

    return function (v: Vector3) {

      return v.copy(direction).applyQuaternion(this.ship.quaternion);
    
    };
  
  };

  moveForward (distance: number): void {

    // move forward parallel to the xz-plane
    // assumes camera.up is y-up

    _vector.setFromMatrixColumn(this.ship.matrix, 0);

    _vector.crossVectors(this.ship.up, _vector);

    this.ship.position.addScaledVector(_vector, distance);
  
  };

  moveRight (distance: number): void {

    _vector.setFromMatrixColumn(this.ship.matrix, 0);
    this.ship.position.addScaledVector(_vector, distance);
  
  };

  private lock (): void {

    this.gameElement.requestPointerLock();
  
  };

  unlock (): void {

    this.gameElement.ownerDocument.exitPointerLock();
  
  };

  private commandShip (pressedKeys: PressedKeys): void {

    pressedKeys.includes(ControlKeys.w) ? this.ship.startMovingForward() : this.ship.stopMovingForward();
    pressedKeys.includes(ControlKeys.s) ? this.ship.startMovingBackwards() : this.ship.stopMovingBackwards();
    pressedKeys.includes(ControlKeys.d) ? this.ship.startMovingRight() : this.ship.stopMovingRight();
    pressedKeys.includes(ControlKeys.a) ? this.ship.startMovingLeft() : this.ship.stopMovingLeft();
    pressedKeys.includes(ControlKeys.space) ? this.ship.dash() : (() => {})();
    pressedKeys.includes(ControlKeys.q) ? (<Bot[]> this.ship.player.enemies).forEach(e => e.movePointerToChasePoint()) : (() => {})();
  
  }

}

export default DesktopShipControls;
