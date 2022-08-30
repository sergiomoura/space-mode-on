import Game from '../Game/Game';

class Hall {

  private readonly selectEnemies: HTMLSelectElement;
  private readonly selectFriends: HTMLSelectElement;
  private readonly inputPlayerName: HTMLInputElement;
  private readonly btStart: HTMLButtonElement;
  private readonly divHall: HTMLDivElement;
  private readonly formGameSettings: HTMLFormElement;
  private readonly transitionDuration: number = 0.3;

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
        this.createGame();
      
      }
    );

    window.addEventListener(
      'load',
      () => { this.inputPlayerName.focus(); }
    );

  }

  private createGame (): void {

    // Criando o jogo
    const game = new Game(
      this.inputPlayerName.value,
      Number(this.selectEnemies.value),
      Number(this.selectFriends.value)
    );

    // Conectando controles do jogo
    game.connectControls();
  
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
