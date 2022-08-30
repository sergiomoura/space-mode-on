// Importando estilo
import './styles/style.scss';
import Hall from './game-components/Hall/Hall';

const hall = new Hall();
hall.connect();

/*
// Imports
import Game from "./game-components/Game/Game";

// Recuperando os canvas
let mainCanvas = <HTMLCanvasElement>document.getElementById('mainCanvas');
let auxCanvas = <HTMLCanvasElement>document.getElementById('auxCanvas');

// Criando o jogo
const game = new Game(
                window.innerHeight,
                window.innerWidth,
                mainCanvas,
                auxCanvas,
                'Sérgio Moura'
            );

window.addEventListener('resize', () => { game.setSize(window.innerHeight, window.innerWidth) })
*/
