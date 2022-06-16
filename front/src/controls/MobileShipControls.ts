import Ship from "../game-components/Ship/Ship";

class MobileShipControls {

    private mobileScreen:HTMLDivElement;
    private btShooter: HTMLButtonElement;
    private btDasher: HTMLButtonElement;
    private btJoystick: HTMLButtonElement;

    constructor(private ship:Ship){
        
        this.mobileScreen = <HTMLDivElement>document.getElementById('mobile-controls');
        this.btShooter = <HTMLButtonElement>document.getElementById('shooter');
        this.btDasher = <HTMLButtonElement>document.getElementById('dasher');
        this.btJoystick = <HTMLButtonElement>document.getElementById('joystick');

        this.associateEvents();
    
    }

    private associateEvents(){
        this.btShooter.addEventListener('click', ()=>{this.ship.shoot()});
        this.btDasher.addEventListener('click', ()=>{this.ship.dash()});
    }

}

export default MobileShipControls;