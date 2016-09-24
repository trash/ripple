import {GameManager} from './game/game-manager';
import {Ripple} from './views/ripple';

const rootElement = document.querySelector('.ripple');
const gameManager = new GameManager(rootElement);