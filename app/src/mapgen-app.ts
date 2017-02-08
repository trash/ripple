import './polyfills';
import {GameManager} from './game/GameManager';

const rootElement = document.querySelector('.ripple');
const gameManager = new GameManager(rootElement, 'mapgen');