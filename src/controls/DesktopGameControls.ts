import Game from '../game-components/Game/Game';

enum PossibleKeys {
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight'
}

class DesktopGameControls {

  constructor (private readonly game: Game) {

    document.body.addEventListener('keydown', evt => { this.onKeyDown(evt); });
  
  }

  private readonly keyMethods = {
    ArrowLeft: () => {

      this.game.switchToPreviousCamera();
    
    },
    ArrowRight: () => {

      this.game.switchNextCamera();
    
    }
  };

  onKeyDown (evt: KeyboardEvent): void {

    if (evt.ctrlKey && Object.keys(this.keyMethods).includes(<PossibleKeys> evt.key)) {

      this.keyMethods[<PossibleKeys>evt.key]();
    
    }
  
  }

}

export default DesktopGameControls;
