import {
	Euler,
	EventDispatcher,
	Vector3
} from 'three';
import Ship from './Ship';

const _euler = new Euler( 0, 0, 0, 'YXZ' );
const _vector = new Vector3();

const _changeEvent = { type: 'change' };
const _lockEvent = { type: 'lock' };
const _unlockEvent = { type: 'unlock' };

const _PI_2 = Math.PI / 2;

class DesktopShipControls extends EventDispatcher {
	
	private domElement:HTMLElement;
	private isLocked:boolean;
	private minPolarAngle:number;
	private maxPolarAngle:number;
	private pointerSpeed:number;

	constructor( private _ship:Ship, domElement:HTMLElement ) {

		super();

		if ( domElement === undefined ) {

			console.warn( 'THREE.PointerLockControls: The second parameter "domElement" is now mandatory.' );
			domElement = document.body;

		}

		this.domElement = domElement;
		this.isLocked = false;

		// Set to constrain the pitch of the camera
		// Range is 0 to Math.PI radians
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		this.pointerSpeed = 1.0;

		const scope = this;

		this.connect();

	}

	
	public get ship() : Ship {
		return this._ship
	}
	

	onMouseMove( evt:MouseEvent ) {

		if ( this.isLocked === false ) return;

		const movementX = evt.movementX || 0;
		const movementY = evt.movementY || 0;
		
		_euler.setFromQuaternion( this._ship.quaternion );

		_euler.y -= movementX * 0.002 * this.pointerSpeed;
		_euler.x -= movementY * 0.002 * this.pointerSpeed;

		_euler.x = Math.max( _PI_2 - this.maxPolarAngle, Math.min( _PI_2 - this.minPolarAngle, _euler.x ) );

		this._ship.quaternion.setFromEuler( _euler );

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

		_vector.setFromMatrixColumn( this._ship.matrix, 0 );

		_vector.crossVectors( this._ship.up, _vector );

		this._ship.position.addScaledVector( _vector, distance );

	};

	moveRight( distance:number ) {
		_vector.setFromMatrixColumn( this._ship.matrix, 0 );
		this._ship.position.addScaledVector( _vector, distance );
	};

	lock() {
		this.domElement.requestPointerLock();
	};

	unlock() {
		this.domElement.ownerDocument.exitPointerLock();
	};
}

export { DesktopShipControls };
