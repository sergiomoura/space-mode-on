interface DamageFunction {
    (damage:number):void;
}

interface DieFunction {
    ():void
}

export default interface Damageble {
    life: number;
    getDamage: DamageFunction;
    die:DieFunction;
}