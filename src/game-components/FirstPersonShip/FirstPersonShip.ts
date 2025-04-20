import { PerspectiveCamera } from 'three';
import Ship from '../Ship/Ship';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export default class FirstPersonShip extends Ship {

  constructor (private readonly _camera: PerspectiveCamera, model: GLTF) {

    super(model);

    // Definindo e posicionando camera
    this._camera.position.z = 7;
    this._camera.position.y = 2;
    this._camera.rotateX(-0.05);

    // Adicionando câmera
    this.add(this._camera);
  
  }

  public get camera (): PerspectiveCamera {

    return this._camera;
  
  }

}
