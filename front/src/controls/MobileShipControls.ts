import Ship from "../game-components/Ship/Ship";

class MobileShipControls {

    private _mobileScreen:HTMLDivElement;
    private _btShooter: HTMLButtonElement;
    private _btDasher: HTMLButtonElement;
    private _btJoystick: HTMLButtonElement;

    constructor(private ship:Ship){
        
        this._mobileScreen = <HTMLDivElement>document.getElementById('mobile-controls');
        this._btShooter = <HTMLButtonElement>document.getElementById('shooter');
        this._btDasher = <HTMLButtonElement>document.getElementById('dasher');
        this._btJoystick = <HTMLButtonElement>document.getElementById('joystick');

        this.associateEvents();
    
    }

    private associateEvents(){

        // Associando eventos ao botão de tiro
        this._btShooter.addEventListener(
            'touchstart',
            (evt)=>{
                evt.stopPropagation();
                this.ship.shoot();
            }
        );

        // Associando eventos ao botão de dash
        this._btDasher.addEventListener(
            'touchend',
            evt=>{
                evt.stopPropagation();
                this.ship.dash()
            }
        );

        // this._mobileScreen.addEventListener('touchstart', evt=>{evt.stopPropagation();console.log(evt)}, false)
        // this._mobileScreen.addEventListener('touchmove', evt=>console.log(evt), false)
        // this._mobileScreen.addEventListener('touchend', evt=>console.log(evt), false)
    }

    private shoot(){

    }

    

}

export default MobileShipControls;