// Importando estilo
import './styles/style.scss';
import Hall from './game-components/Hall/Hall';
import Game from './game-components/Game/Game';
import GameEvents from './lib/GameEvents';

// Iniciando jogo de background
let game: Game = new Game();
game.start('', 6, 6, true);

// Conectando hall
const hall = new Hall();
hall.connect();
hall.onFormSubmit = () => {

  game = new Game();
  game.addEventListener(GameEvents.MAIN_PLAYER_DIED, () => {

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
