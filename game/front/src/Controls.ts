// import MovingCamera from "./MovingCamera";
// import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { DesktopShipControls } from "./DesktopShipControls";
import Ship from "./Ship";

export default class Controls extends DesktopShipControls{

    constructor(ship:Ship,  canvas: HTMLCanvasElement) {
        
        super(ship, canvas);

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
            keys.w ? this.ship.startMovingForward() : this.ship.stopMovingForward();
            keys.s ? this.ship.startMovingBackwards() : this.ship.stopMovingBackwards();
            keys.d ? this.ship.startMovingRight() : this.ship.stopMovingRight();
            keys.a ? this.ship.startMovingLeft() : this.ship.stopMovingLeft();
        }

        document.body.addEventListener('keydown', onKeyDown, false);
        document.body.addEventListener('keyup', onKeyUp, false);
        
    }
    
}