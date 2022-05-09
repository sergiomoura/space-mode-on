import { PerspectiveCamera } from "three";

const cameraX:PerspectiveCamera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight);
const cameraY:PerspectiveCamera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight);
const cameraZ:PerspectiveCamera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight);

cameraX.position.x = 20;
cameraY.position.y = 20;
cameraZ.position.z = 20;

cameraX.lookAt(0,0,0);
cameraY.lookAt(0,0,0);
cameraZ.lookAt(0,0,0);

const Cameras:PerspectiveCamera[] = [cameraX, cameraY, cameraZ];

export default Cameras;

