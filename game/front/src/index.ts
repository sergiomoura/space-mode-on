import './styles/style.scss';

import Game from "./Game";
const game = new Game(window.innerHeight, window.innerWidth);
document.body.appendChild(game.renderer.domElement);
window.addEventListener('resize', () => { game.setSize(window.innerHeight, window.innerWidth) })
game.drawAxis();