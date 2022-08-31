import Game from '../Game/Game';

class Hall {

  private readonly selectEnemies: HTMLSelectElement;
  private readonly selectFriends: HTMLSelectElement;
  private readonly inputPlayerName: HTMLInputElement;
  private readonly btStart: HTMLButtonElement;
  private readonly divHall: HTMLDivElement;
  private readonly formGameSettings: HTMLFormElement;
  private readonly transitionDuration: number = 0.3;
  private game: Game;

  constructor () {

    // Capturando elementos
    this.selectEnemies = <HTMLSelectElement> document.getElementById('nEnemies');
    this.selectFriends = <HTMLSelectElement> document.getElementById('nFriends');
    this.inputPlayerName = <HTMLInputElement> document.getElementById('playerName');
    this.btStart = <HTMLButtonElement> document.getElementById('start');
    this.divHall = <HTMLDivElement> document.getElementById('hall');
    this.formGameSettings = <HTMLFormElement> document.getElementById('gameSettings');
    this.divHall.style.transition = `opacity linear ${this.transitionDuration}s`;
  
  }

  public connect (): void {
     
    // Associando eventos
    this.formGameSettings.addEventListener(
      'submit',
      evt => {

        evt.preventDefault();
        this.hideHall();
        this.createNewGame();
      
      }
    );

    window.addEventListener(
      'load',
      () => { this.inputPlayerName.focus(); }
    );

  }

  private createNewGame (): void {

    // Criando o jogo
    this.game = new Game(
      this.inputPlayerName.value,
      Number(this.selectEnemies.value),
      Number(this.selectFriends.value)
    );

    // Conectando controles do jogo
    this.game.connectControls();

    // Associando evento... se morrer, volta para o hall!
    this.game.addEventListener(
      'died',
      (evt) => {

        this.showHall();
        this.game.suspend();
        
        // Artasando o foco no input do nome
        setTimeout(() => { this.inputPlayerName.focus(); }, 500);
      
      }
    );
  
  }

  private showHall (died: boolean = true): void {
    
    this.divHall.style.display = 'flex';
    this.divHall.style.opacity = '1';
  
  }

  private hideHall (): void {

    this.divHall.style.opacity = '0';
    this.divHall.addEventListener(
      'transitionend',
      () => { this.divHall.style.display = 'none'; }
    );
  
  }

}

export default Hall;
