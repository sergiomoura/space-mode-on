import { PerspectiveCamera } from 'three';
import FirstPersonShip from '../FirstPersonShip/FirstPersonShip';
import Player from '../Player/Player';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export default class User extends Player {

  constructor (name: string, model: GLTF) {

    super(name);
    const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight);
    this.ship = new FirstPersonShip(camera, model);
    this.ship.name = `SHIP-OF-${name}`;
    this.ship.drawDirection();
  
  }

}
