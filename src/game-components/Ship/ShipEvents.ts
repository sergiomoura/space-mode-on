import { Object3DEventMap } from "three";
import Shot from "../Shot/Shot";

export enum ShipEvents {
    SHIP_DESTROYED = 'shipDestroyed',
    SHIP_GOT_DAMAGE = 'shipGotDamaged',
    SHIP_SHOOT = 'shipShoot',
}

export interface ShipEventsMap extends Object3DEventMap {
    [ShipEvents.SHIP_DESTROYED]: {  };
    [ShipEvents.SHIP_GOT_DAMAGE]: { damage: number };
    [ShipEvents.SHIP_SHOOT]: { shot: Shot };
}