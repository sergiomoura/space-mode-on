import {
	Euler,
	EventDispatcher,
	Vector3
} from 'three';
import Ship from '../Ship';
import { PressedKeys, ObservableKeyboard } from "../lib/ObservableKeyboard";

const _vector = new Vector3();
const _changeEvent = { type: 'change' };
const _lockEvent = { type: 'lock' };
const _unlockEvent = { type: 'unlock' };

enum ControlKeys {
	w = 'KeyW',
	s = 'KeyS',
	a = 'KeyA',
	d = 'KeyD',
	space = "Space"
}

class DesktopShipControls extends EventDispatcher {
	
	private domElement:HTMLElement;
	private isLocked:boolean;

	constructor( private ship:Ship, domElement:HTMLElement ) {

		super();

        ObservableKeyboard.subscribe((pressedKeys:PressedKeys)=>{this.commandShip(pressedKeys)});

		if ( domElement === undefined ) {

			console.warn( 'THREE.PointerLockControls: The second parameter "domElement" is now mandatory.' );
			domElement = document.body;

		}

		this.domElement = domElement;
		this.isLocked = false;

		domElement.addEventListener(
            'click',
            () => {
                this.lock();
            },
            false
        )

		this.connect();

	}

	onMouseMove( evt:MouseEvent ) {

		if ( this.isLocked === false ) return;

		const movementX = evt.movementX || 0;
		const movementY = evt.movementY || 0;
		
		this.ship.pointTo(movementX, movementY)

		this.dispatchEvent( _changeEvent );

	}

	onPointerlockChange() {

		if ( this.domElement.ownerDocument.pointerLockElement === this.domElement ) {
			this.dispatchEvent( _lockEvent );
			this.isLocked = true;
		} else {
			this.dispatchEvent( _unlockEvent );
			this.isLocked = false;
		}

	}

	onPointerlockError() {
		console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );
	}

	connect() {

		this.domElement.ownerDocument.addEventListener( 'mousemove', (evt)=>{this.onMouseMove(evt)} );
		this.domElement.ownerDocument.addEventListener( 'pointerlockchange', (evt)=>{this.onPointerlockChange()} );
		this.domElement.ownerDocument.addEventListener( 'pointerlockerror', (evt)=>{this.onPointerlockError} );

	}

	disconnect() {

		this.domElement.ownerDocument.removeEventListener( 'mousemove', this.onMouseMove );
		this.domElement.ownerDocument.removeEventListener( 'pointerlockchange', this.onPointerlockChange );
		this.domElement.ownerDocument.removeEventListener( 'pointerlockerror', this.onPointerlockError );

	};

	dispose() {

		this.disconnect();

	};

	getDirection() {

		const direction = new Vector3( 0, 0, - 1 );

		return function ( v:Vector3 ) {

			return v.copy( direction ).applyQuaternion( this.ship.quaternion );

		};

	};

	moveForward( distance:number ) {

		// move forward parallel to the xz-plane
		// assumes camera.up is y-up

		_vector.setFromMatrixColumn( this.ship.matrix, 0 );

		_vector.crossVectors( this.ship.up, _vector );

		this.ship.position.addScaledVector( _vector, distance );

	};

	moveRight( distance:number ) {
		_vector.setFromMatrixColumn( this.ship.matrix, 0 );
		this.ship.position.addScaledVector( _vector, distance );
	};

	lock() {
		this.domElement.requestPointerLock();
	};

	unlock() {
		this.domElement.ownerDocument.exitPointerLock();
	};

    private commandShip(pressedKeys:PressedKeys){
        pressedKeys.indexOf(ControlKeys.w) > -1 ? this.ship.startMovingForward() : this.ship.stopMovingForward(); 
        pressedKeys.indexOf(ControlKeys.s) > -1 ? this.ship.startMovingBackwards() : this.ship.stopMovingBackwards(); 
        pressedKeys.indexOf(ControlKeys.d) > -1 ? this.ship.startMovingRight() : this.ship.stopMovingRight(); 
        pressedKeys.indexOf(ControlKeys.a) > -1 ? this.ship.startMovingLeft() : this.ship.stopMovingLeft();
		pressedKeys.indexOf(ControlKeys.space) > -1 ? this.ship.dash() : null ;
    }
}

export { DesktopShipControls };
