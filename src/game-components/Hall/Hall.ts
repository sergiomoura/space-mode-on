import Game from '../Game/Game';

class Hall {

  private readonly selectEnimies: HTMLSelectElement;
  private readonly selectFriends: HTMLSelectElement;
  private readonly inputPlayerName: HTMLInputElement;
  private readonly btStart: HTMLButtonElement;
  private readonly divHall: HTMLDivElement;
  constructor () {

    // Capturando elementos
    this.selectEnimies = <HTMLSelectElement>document.getElementById('nEnemies');
    this.selectFriends = <HTMLSelectElement>document.getElementById('nFriends');
    this.inputPlayerName = <HTMLInputElement>document.getElementById('playerName');
    this.btStart = <HTMLButtonElement>document.getElementById('start');
    this.divHall = <HTMLDivElement>document.getElementById('hall');

  }

  public connect (): void {
     
    // Associando eventos
    this.btStart.addEventListener(
      'click',
      () => {
        
        this.createGame();
        this.hideHall();
      
      }
    );

  }

  private createGame (): void {

    // Recuperando os canvas
    const mainCanvas = <HTMLCanvasElement>document.getElementById('mainCanvas');
    const auxCanvas = <HTMLCanvasElement>document.getElementById('auxCanvas');

    // Criando o jogo
    const game = new Game(
      window.innerHeight,
      window.innerWidth,
      mainCanvas,
      auxCanvas,
      'Sérgio Moura'
    );

    // Imprimindo mensagem no console
    console.log(`Jogo começou com ${game.ships.length} naves.`);
  
  }

  private hideHall (): void {

    this.divHall.remove();
  
  }

}

export default Hall;
