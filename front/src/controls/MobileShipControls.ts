import Ship from "../game-components/Ship/Ship";

const frac = Math.PI/8;
const MaxTanDireita = Math.tan(3*frac);
const MinTanDireita = -Math.tan(3*frac);

class MobileShipControls {

    private _mobileScreen:HTMLDivElement;
    private _btShooter: HTMLButtonElement;
    private _btDasher: HTMLButtonElement;
    private _btJoystick: HTMLButtonElement;

    constructor(private _ship:Ship){
        
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
                this._ship.shoot();
            }
        );

        // Associando eventos ao botão de dash
        this._btDasher.addEventListener(
            'touchend',
            evt=>{
                evt.stopPropagation();
                this._ship.dash()
            }
        );
        
        // Associando eventos ao joystick
        this._btJoystick.addEventListener(
            'touchmove',
            evt => {
                evt.cancelBubble = true;

                let x = evt.changedTouches[0].clientX - this._btJoystick.offsetLeft - this._btJoystick.offsetWidth/2 + 1;
                let y = evt.changedTouches[0].clientY - this._btJoystick.offsetTop - this._btJoystick.offsetHeight/2 + 1;
                let ratio = y/x;
                
                if(x > 0 && ratio < MaxTanDireita && ratio>MinTanDireita){
                    this._ship.startMovingRight();
                } else {
                    this._ship.stopMovingRight();
                }

                if(x < 0 && ratio < MaxTanDireita && ratio>MinTanDireita){
                    this._ship.startMovingLeft();
                } else {
                    this._ship.stopMovingLeft();
                }

                ratio = x/-y;

                if(y < 0 && ratio < MaxTanDireita && ratio>MinTanDireita){
                    this._ship.startMovingForward();
                } else {
                    this._ship.stopMovingForward();
                }

                if(y > 0 && ratio < MaxTanDireita && ratio>MinTanDireita){
                    this._ship.startMovingBackwards();
                } else {
                    this._ship.stopMovingBackwards();
                }


            }
        )

        // this._mobileScreen.addEventListener('touchstart', evt=>{evt.stopPropagation();console.log(evt)}, false)
        //this._mobileScreen.addEventListener('touchmove', evt=>console.log(evt))
        // this._mobileScreen.addEventListener('touchend', evt=>console.log(evt), false)
    }

    private shoot(){

    }

    

}

export default MobileShipControls;