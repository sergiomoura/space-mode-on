import { PerspectiveCamera } from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import Ship from "./Ship";

export default class Controls extends PointerLockControls{

    constructor(private ship:Ship, private camera:PerspectiveCamera, private canvas: HTMLCanvasElement) {
        
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
        
        let onKeyDown = (evt:KeyboardEvent)=>{keys[<Key>evt.key] = true; move()};
        let onKeyUp = (evt:KeyboardEvent)=>{keys[<Key>evt.key] = false; move()};
        let move = ()=>{
            if(keys.w){this.moveForward(+0.1)};
            if(keys.s){this.moveForward(-0.1)};
            if(keys.a){this.moveRight(-0.1)};
            if(keys.d){this.moveRight(+0.1)};
        }

        document.body.addEventListener('keydown', onKeyDown, false);
        document.body.addEventListener('keyup', onKeyUp, false);
        
    }



    
}