// Importando estilo
import './styles/style.scss';
import Hall from './game-components/Hall/Hall';
import Game from './game-components/Game/Game';
import GameEvents from './lib/GameEvents';

// Capturando elementos de interesse
const mainCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('mainCanvas');
const auxCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('auxCanvas');

// Iniciando jogo de background
const demoGame: Game = new Game(mainCanvas, auxCanvas);
demoGame.start('', 6, 6, true);

// Conectando hall
const hall = new Hall(
  <HTMLSelectElement> document.getElementById('nEnemies'),
  <HTMLSelectElement> document.getElementById('nFriends'),
  <HTMLInputElement> document.getElementById('playerName'),
  <HTMLDivElement> document.getElementById('hall'),
  <HTMLFormElement> document.getElementById('gameSettings')
);
hall.connect();
hall.onFormSubmit = () => {

  const game = new Game(mainCanvas, auxCanvas);

  game.addEventListener(GameEvents.MAIN_PLAYER_DIED, () => {

    hall.show(false);
    game.suspend();
  
  });

  game.addEventListener(GameEvents.MAIN_PLAYER_WON, () => {

    hall.show(true);
    game.suspend();
  
  });

  game.start(
    hall.playerName,
    hall.nEnemies,
    hall.nFriends,
    false
  );

  hall.hide();

};
