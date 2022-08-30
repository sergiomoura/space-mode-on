// Importando estilo
import './styles/style.scss';
import Hall from './game-components/Hall/Hall';
import Game from './game-components/Game/Game';

// Iniciando jogo de background
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const game: Game = new Game('', 6, 6, true);

// Conectando hall
const hall = new Hall();
hall.connect();
