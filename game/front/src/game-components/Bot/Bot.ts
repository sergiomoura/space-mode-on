import { ArrowHelper, ColorRepresentation, Vector3 } from "three";
import Player from "../Player/Player";
import Ship from "../Ship/Ship";

enum Behaviours {FLEE='flee', CHASE='chase', ATTACK='attack'};
class Decision {
    behaviour:Behaviours;
    ship:Ship;
}

export default class Bot extends Player{
    
    private _decisionFrequency = 200; // 0.2 seconds
    private _targetShip:Ship;
    private _minimunAimingDistance = 2;
    private _behaviour: Behaviours = Behaviours.CHASE;
    private _chasedPoint: Vector3 = new Vector3(10, 10, 3);

    public get behaviour(): Behaviours {return this._behaviour;}
    public set behaviour(value: Behaviours) {
        this._behaviour = value;
        switch (value) {
            case Behaviours.FLEE:
                this.ship.color = 0xFFFF00;
                this.fleeFrom(this._targetShip);
                break;

            case Behaviours.ATTACK:
                this.ship.color = 0xFF0000;
                this.attack(this._targetShip);
                break;
            
            case Behaviours.CHASE:
                this.ship.color = 0x6666FF;
                this.chase(this._targetShip);
                break;
        
            default:
                break;
        }
    }

    constructor(color: ColorRepresentation) {
        super(`BOT-${Math.round(Math.random()*10000)}`);
        this.ship = new Ship(color);
        // this.ship.drawLocalAxis();
        this.ship.drawDirection();
        this.ship.startMovingForward();
        this.ship.name = `SHIP-OF-${this.name}`;
    }

    private fleeFrom(ship:Ship){
        
    }

    private attack(ship:Ship){

    }

    private chase(ship:Ship){

    }


    private move() {
        requestAnimationFrame(() => this.move());
        this.movePointerToChasePoint();
    }

    public movePointerToChasePoint(pointingSpeed:number = 18){

            // Definindo o chasePoint
            this._chasedPoint = this.enemies[0].ship.position;

            // Declarando vetor que aponta do chasedPoint à posição atual: d
            let d:Vector3 = this._chasedPoint.clone().sub(this.ship.position);

            // Obtendo o vetor p projetando o vetor d no vetor direção da nave
            let p:Vector3 = d.clone().projectOnVector(this.ship.direction.normalize());

            // Obtendo o vetor u que é a projeção de d no plano da tela
            let u:Vector3 = d.clone().sub(p).normalize();
            
            // Representando u no sistema de coordenadas local
            let t = u.clone().applyQuaternion(this.ship.quaternion.clone().conjugate());

            // Redimensionando o vetor de mudança de direção
            t.multiplyScalar(pointingSpeed);

            // Mudando a direção da nave
            this.ship.pointTo(t.x, -t.y);
        
    }

    public init(){
        let decision = this.decideBehaviour();
        this._targetShip = decision.ship;
        this.behaviour = decision.behaviour;
        this.move();

        // Iniciando decisão perpétuo
        setInterval(()=>{
            let decision = this.decideBehaviour();
            this._targetShip = decision.ship;
            this.behaviour = decision.behaviour;            
        }, this._decisionFrequency)
    }

    private decideBehaviour():Decision{

        // Determinando as variáveis de retorno
        let decision:Decision = {
            behaviour: undefined,
            ship: undefined
        }

        // Levantando as naves inimigas
        let enemyShips = this.enemies.map(e=>e.ship);

        // Levantando vetores de mira em mim
        let aimVectors = this.ship.aimVectorsOnMe;

        // Verificando tamanho de vetores de mira.
        // Quanto menor, mais perigoso
        let index = 0;
        let minLength = aimVectors[0] != undefined ? aimVectors[0].length() : Infinity;
        for (let i = 0; i < aimVectors.length; i++) {
            let length = aimVectors[i]!=undefined ? aimVectors[i].length() : Infinity;
            if(length < minLength){
                index = i;
                minLength = length;
            }
        }
        
        // Verificando se a menor distância é menor que o tolerável
        if(minLength < this._minimunAimingDistance){
            decision.behaviour = Behaviours.FLEE;
            decision.ship = enemyShips[index];
            return decision;
        }
        
        // Distâncias entre as naves inimigas e a própria nave
        let {ship:closestShip, distance} = enemyShips.reduce(
            (previous, current, currentIndex)=>{
                let previousDistance = previous.ship.position.distanceTo(this.ship.position);
                let currentDistance = current.position.distanceTo(this.ship.position);
                if(currentDistance < previousDistance ){
                    return {ship:enemyShips[currentIndex], distance: currentDistance}
                } else {
                    return {ship:enemyShips[currentIndex - 1], distance: previousDistance}
                }
            }
            ,
            {ship: enemyShips[0], distance: this.ship.position.distanceTo(enemyShips[0].position)}
        )

        // Se a menor distância entre a própria nave e a nave inimiga for menor que o alcance de ataque, atacar!
        // Caso contrário, perseguir
        if(distance <= this.ship.attackRange){
            return {behaviour:Behaviours.ATTACK, ship:closestShip}
        } else {
            return {behaviour:Behaviours.CHASE, ship:closestShip}
        }
    }

}