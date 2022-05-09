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

	public connect:Function;
	public dispose:Function;
	public getObject:Function;
	public disconnect:Function;
	public getDirection:Function;
	public moveForward:Function;
	public moveRight: Function;
	public lock: Function;
	public unlock: Function;

	constructor( ship:Ship, domElement:HTMLElement ) {

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

		function onMouseMove( evt:MouseEvent ) {

			if ( scope.isLocked === false ) return;

			const movementX = evt.movementX || 0;
			const movementY = evt.movementY || 0;

			_euler.setFromQuaternion( ship.quaternion );

			_euler.y -= movementX * 0.002 * scope.pointerSpeed;
			_euler.x -= movementY * 0.002 * scope.pointerSpeed;

			_euler.x = Math.max( _PI_2 - scope.maxPolarAngle, Math.min( _PI_2 - scope.minPolarAngle, _euler.x ) );

			ship.quaternion.setFromEuler( _euler );

			scope.dispatchEvent( _changeEvent );

		}

		function onPointerlockChange() {

			if ( scope.domElement.ownerDocument.pointerLockElement === scope.domElement ) {

				scope.dispatchEvent( _lockEvent );

				scope.isLocked = true;

			} else {

				scope.dispatchEvent( _unlockEvent );

				scope.isLocked = false;

			}

		}

		function onPointerlockError() {

			console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );

		}

		this.connect = function () {

			scope.domElement.ownerDocument.addEventListener( 'mousemove', onMouseMove );
			scope.domElement.ownerDocument.addEventListener( 'pointerlockchange', onPointerlockChange );
			scope.domElement.ownerDocument.addEventListener( 'pointerlockerror', onPointerlockError );

		};

		this.disconnect = function () {

			scope.domElement.ownerDocument.removeEventListener( 'mousemove', onMouseMove );
			scope.domElement.ownerDocument.removeEventListener( 'pointerlockchange', onPointerlockChange );
			scope.domElement.ownerDocument.removeEventListener( 'pointerlockerror', onPointerlockError );

		};

		this.dispose = function () {

			this.disconnect();

		};

		this.getObject = function () { // retaining this method for backward compatibility

			return this.ship;

		};

		this.getDirection = function () {

			const direction = new Vector3( 0, 0, - 1 );

			return function ( v:Vector3 ) {

				return v.copy( direction ).applyQuaternion( ship.quaternion );

			};

		}();

		this.moveForward = function ( distance:number ) {

			// move forward parallel to the xz-plane
			// assumes camera.up is y-up

			_vector.setFromMatrixColumn( ship.matrix, 0 );

			_vector.crossVectors( ship.up, _vector );

			ship.position.addScaledVector( _vector, distance );

		};

		this.moveRight = function ( distance:number ) {

			_vector.setFromMatrixColumn( ship.matrix, 0 );

			ship.position.addScaledVector( _vector, distance );

		};

		this.lock = function () {

			this.domElement.requestPointerLock();

		};

		this.unlock = function () {

			scope.domElement.ownerDocument.exitPointerLock();

		};

		this.connect();

	}

}

export { DesktopShipControls };
