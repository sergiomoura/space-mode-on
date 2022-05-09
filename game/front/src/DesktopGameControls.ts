import Game from "./Game";

enum PossibleKeys {
    ArrowLeft = "ArrowLeft",
    ArrowRight = "ArrowRight"
}

class DesktopGameControls {
    
    constructor(private game:Game){
        document.body.addEventListener('keydown', evt => {this.onKeyDown(evt)})
    }

    private keyMethods = {
        ArrowLeft:()=>{
            this.game.switchToPreviousCamera();
        },
        ArrowRight:()=>{
            this.game.switchNextCamera();
        }
    }

    onKeyDown(evt: KeyboardEvent){
        if(evt.ctrlKey && this.keyMethods[<PossibleKeys>evt.key]){
            this.keyMethods[<PossibleKeys>evt.key]()
        }
    }
}

export default DesktopGameControls;