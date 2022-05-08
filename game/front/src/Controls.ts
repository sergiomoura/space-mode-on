import { PerspectiveCamera } from "three";
import MovingCamera from "./MovingCamera";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import Ship from "./Ship";

export default class Controls extends PointerLockControls{

    constructor(private ship:Ship, private camera:MovingCamera, private canvas: HTMLCanvasElement) {
        
        super(camera, canvas);

        canvas.addEventListener(
            'click',
            () => {
                this.lock();
            },
            false
        )

        enum Key {
            w = 'w',
            s = 's',
            a = 'a',
            d = 'd'
        }

        let keys = {
            'w': false,
            's': false,
            'a': false,
            'd': false
        }
        
        let onKeyDown = (evt:KeyboardEvent)=>{
            keys[<Key>evt.key] = true;
            moveCamera();
        };
        
        let onKeyUp = (evt:KeyboardEvent)=>{
            keys[<Key>evt.key] = false;
            moveCamera();
        };

        
        let moveCamera = ()=>{
            keys.w ? this.camera.startMovingForward() : this.camera.stopMovingForward();
            keys.s ? this.camera.startMovingBackwards() : this.camera.stopMovingBackwards();
            keys.d ? this.camera.startMovingRight() : this.camera.stopMovingRight();
            keys.a ? this.camera.startMovingLeft() : this.camera.stopMovingLeft();
        }

        document.body.addEventListener('keydown', onKeyDown, false);
        document.body.addEventListener('keyup', onKeyUp, false);
        
    }
    
}