import React = require('react');
import ReactDOM = require('react-dom');
import {events} from '../events';
import TWEEN = require('tween.js');
import {StateManager} from '../state/state-manager';
import {PreloaderState} from '../state/states/preload';
import {MainMenuState} from '../state/states/main-menu';
import {TestSelectState} from '../state/states/test-select';
import {GameState} from '../state/states/game';
import {ITestLevel, ITestGameMapOptions} from '../data/test-level';
import {EntityManager} from '../entity/entity-manager';
import {GameMap, IMapOptions} from '../map';
import {canvasService} from '../ui/canvas-service';
import {util} from '../util';
import {GameLoop} from './game-loop';
import {GameSpeed} from './game-speed';
import {GameCamera} from './game-camera';
import {gameClock} from './game-clock';
import {Tilemap} from '../tilemap';
import {spriteManager} from '../services/sprite-manager';
import {EntitySpawner} from '../entity/entity-spawner';
import {IRowColumnCoordinates} from '../interfaces';
import {gameLevelFactory} from '../data/game-level-factory';
import {keybindings} from '../services/keybindings';
import {GameComponent} from '../views/game';
import {TileInfoService} from '../ui/tile-info-service';
import {constants} from '../data/constants';

const defaultLevel = gameLevelFactory.getDefaultTestLevel();

const windowSize = {
	width: document.body.clientWidth,
	height: document.body.clientHeight
};

export class GameManager {
    state: StateManager;
    entityManager: EntityManager;
    level: ITestLevel;
    map: GameMap;
    renderer: PIXI.WebGLRenderer;
    seed: number;
    loop: GameLoop;
    camera: GameCamera;
    stage: PIXI.Container;
    tilemap: Tilemap;

    constructor (rootElement: Element, mode: string = 'default') {
        console.info(`GameManager initialized. Mode: ${mode}`);
        const gameManager = this;

        events.on('level-selected', (level: ITestLevel) => {
            this.level = level;
            this.state.start('Game');
            this.saveLastOpenedLevel(level);
        });
        events.on('game-start', this.start.bind(this));
        events.on('game-destroy', this.destroy.bind(this));
        events.on(['spawn', '*'], function (entityName: string, tile: IRowColumnCoordinates) {
            gameManager.handleSpawnEvent(this.event[1], entityName, tile);
        });

        this.state = new StateManager(rootElement);
        this.bootstrapGameStates();

        this.entityManager = new EntityManager();
        window['entityManager'] = this.entityManager;

        new TileInfoService(this.entityManager);

        // create a renderer instance.
		this.renderer = new PIXI.WebGLRenderer(windowSize.width, windowSize.height, {
			antialias: false
		});
        canvasService.instantiateCanvas(this.renderer.view);
        this.stage = new PIXI.Container();

        let seeds = [0.663345, 0.8908902304];
		seeds = [0.8908902304];

        this.seed = Math.random();
		// this.seed = util.randomFromList(seeds) || Math.random();

        this.loop = new GameLoop();
		this.loop.on('update', this.update.bind(this));

        new GameSpeed(this.loop);

        this.camera = new GameCamera();

        this.startRenderer();

        this.level = defaultLevel;

        if (mode === 'mapgen') {
            this.state.start('Preload', 'Game');
        } else if (mode === 'default') {
            this.state.start('Preload', 'MainMenu');
        }

        keybindings.on();
    }

    private saveLastOpenedLevel (level: ITestLevel) {
        localStorage.setItem(constants.LAST_LOADED_LEVEL, JSON.stringify(level));
    }

    update (turn: number, stopped: boolean) {
        if (!stopped) {
            gameClock.update();
        }

		this.entityManager.update(turn, stopped);
    }

    startRenderer () {
		var animate = (time?: number) => {
			window.requestAnimationFrame(animate);

			this.camera.update();

			// render the stage
			this.renderer.render(this.stage);

			TWEEN.update(time);
		};
		animate();
	}

    private renderGameUI () {
        const GameComponentFactory = React.createFactory(GameComponent);
        ReactDOM.render(GameComponentFactory(), document.querySelector('.game-ui'));
    }

    start () {
        console.info('Start the game.');
        this.map = this.createMap(this.level.gameMap);
        events.emit('map-update', this.map);

        this.updateTilemap();

		this.map.initialize();

        // Spawn resources
        this.map.resourceList.forEach((resourceName, i) => {
            if (resourceName && resourceName !== 'hill') {
                const tile = this.map.getTileByIndex(i);
                if (tile.isWater) {
                    debugger;
                    this.map.getTileByIndex(i);
                }
                this.entityManager.spawner.spawnResource(resourceName, tile);
            }
        });

        // Spawn agents
        this.level.agents.forEach(agent => {
            this.entityManager.spawner.spawnAgent(agent);
        });

        // Spawn items
        if (this.level.items) {
            Object.keys(this.level.items).forEach(itemName => {
                for (let i = 0; i < this.level.items[itemName]; i++) {
                    this.entityManager.spawner.spawnItem(itemName);
                }
            });
        }

        // Spawn buildings
        if (this.level.buildings) {
            this.level.buildings.forEach(building => {
                this.entityManager.spawner.spawnBuilding(building.buildingName, building.isCompleted, building);
            });
        }

        const startTile = this.map.getRandomTile({
            accessible: true
        });
		this.camera.setToTile(startTile);

        this.loop.start();

        this.renderGameUI();
    }

    updateTilemap () {
		let tilemapData = this.map.getTilemap(),
			tilemap = new Tilemap(tilemapData, this.renderer);

		this.stage.removeChildren();
		if (this.tilemap) {
			tilemap.position.x = this.tilemap.position.x;
			tilemap.position.y = this.tilemap.position.y;
			this.tilemap.destroy(true);
		}

		spriteManager.setTilemap(tilemap);
		this.camera.setTilemap(tilemap);

		this.tilemap = tilemap;

		this.stage.addChild(tilemap);

		return tilemap;
	};

    handleSpawnEvent (entityType: string, entityName: string, tile: IRowColumnCoordinates) {
        console.info(`Should be spawning an entity of type: ${entityType}`);
        switch (entityType) {
            case 'resource':
                this.entityManager.spawner.spawnResource(entityName, tile);
                break;
        }
    }

    createMap (mapData: ITestGameMapOptions) {
        return new GameMap({
			gameManager: this,
			dimension: mapData.dimension,
			seed: mapData.seed || this.seed,
			allLand: mapData.allLand,
            noResources: mapData.noResources
		});
    }

    destroy () {
        console.info('Destroy the current game.');
        this.entityManager.destroy();
    }

    bootstrapGameStates () {
		this.state.add('Preload', PreloaderState);
		this.state.add('MainMenu', MainMenuState);
		this.state.add('Game', GameState);
		this.state.add('TestSelect', TestSelectState);
	};
}