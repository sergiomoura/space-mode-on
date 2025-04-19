import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface GameModelsMap {
    ship: GLTF | undefined;
}

export class GameModels implements GameModelsMap {
    
    public ship: GLTF;

    constructor() {
        this.load();
    }
        
    private load() {
        const loader = new GLTFLoader();
        loader.setPath('../models');
        loader.load('/ship/scene.gltf',
            (gltf) => {
                this.ship = gltf
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