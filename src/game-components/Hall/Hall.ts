import Game from '../Game/Game';

class Hall {

  private readonly selectEnemies: HTMLSelectElement;
  private readonly selectFriends: HTMLSelectElement;
  private readonly inputPlayerName: HTMLInputElement;
  private readonly btStart: HTMLButtonElement;
  private readonly divHall: HTMLDivElement;
  private readonly formGameSettings: HTMLFormElement;

  constructor () {

    // Capturando elementos
    this.selectEnemies = <HTMLSelectElement> document.getElementById('nEnemies');
    this.selectFriends = <HTMLSelectElement> document.getElementById('nFriends');
    this.inputPlayerName = <HTMLInputElement> document.getElementById('playerName');
    this.btStart = <HTMLButtonElement> document.getElementById('start');
    this.divHall = <HTMLDivElement> document.getElementById('hall');
    this.formGameSettings = <HTMLFormElement> document.getElementById('gameSettings');

  }

  public connect (): void {
     
    // Associando eventos
    this.formGameSettings.addEventListener(
      'submit',
      evt => {

        evt.preventDefault();
        this.createGame();
        this.hideHall();
      
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

    this.divHall.remove();
  
  }

}

export default Hall;
