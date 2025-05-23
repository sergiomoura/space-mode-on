// Importando estilo
import './styles/style.scss';
import Hall from './game-components/Hall/Hall';
import Game from './game-components/Game/Game';
import GameEvents from './lib/GameEvents';
import { GameModels } from './models/GameModels';
import { Overlay } from './game-components/Overlay/Overlay';

// Capturando canvas
const mainCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('mainCanvas');
const auxCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('auxCanvas');

// Conectando hall
const hall = new Hall(
  <HTMLSelectElement> document.getElementById('nEnemies'),
  <HTMLSelectElement> document.getElementById('nFriends'),
  <HTMLInputElement> document.getElementById('playerName'),
  <HTMLDivElement> document.getElementById('hall'),
  <HTMLFormElement> document.getElementById('gameSettings')
);

// Criando jogo
let game: Game;
const models = new GameModels();
const healthBar = new Overlay(
    <HTMLDivElement>document.getElementById('health-bar'),
    <HTMLDivElement>document.getElementById('dash-bar')
  );

hall.addEventListener(Hall.SUBMIT, () => {

  game = new Game(mainCanvas, auxCanvas, models);

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

  healthBar.connect(game);

  hall.hide();

});

hall.connect();
