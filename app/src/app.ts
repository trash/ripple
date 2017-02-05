PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
import './polyfills';
import {GameManager} from './game/game-manager';

const rootElement = document.querySelector('.ripple');
const gameManager = new GameManager(rootElement);