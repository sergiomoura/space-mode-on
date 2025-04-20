import { ArrowHelper, Vector3 } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface GameModelsMap {
    ship: GLTF | undefined;
}

export class GameModels implements GameModelsMap {
    
    public ship: GLTF;
    public enemyShip: GLTF;
    public friendShip: GLTF;

    constructor() {
        this.load();
    }
        
    private load() {
        this.loadShip();
        this.loadEnemyShip();
        this.loadFriendShip();
    }

    private loadShip() {
        const loader = new GLTFLoader();
        loader.setPath('../models');
        loader.load('/ship/scene.gltf',
            (gltf) => {
                this.ship = gltf;
                this.ship.scene.castShadow = true;
                this.ship.scene.receiveShadow = true;
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('An error happened');
            }
        );
    }

    private loadEnemyShip() {
        const loader = new GLTFLoader();
        loader.setPath('../models');
        loader.load('/ship-enemy/scene.gltf',
            (gltf) => {
                this.enemyShip = gltf;
                this.enemyShip.scene.castShadow = true;
                this.enemyShip.scene.receiveShadow = true;
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('An error happened');
            }
        );
    }

    private loadFriendShip() {
        const loader = new GLTFLoader();
        loader.setPath('../models');
        loader.load('/ship-friend/scene.gltf',
            (gltf) => {
                this.friendShip = gltf;
                this.friendShip.scene.castShadow = true;
                this.friendShip.scene.receiveShadow = true;
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('An error happened');
            }
        );
    }
}