import * as _ from 'lodash';
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {events} from '../events';
import * as TWEEN from 'tween.js';
import {StateManager} from '../state/state-manager';
import {
    PreloaderState,
    MainMenuState,
    TestSelectState,
    GameState
} from '../state/states';
import {State} from '../state/StateEnum';
import {ITestLevel, ITestGameMapOptions} from '../data/testLevel';
import {EntityManager} from '../entity/entityManager';
import {GameMap, IMapOptions} from '../map';
import {canvasService} from '../ui/canvas-service';
import {placeBuildingService} from '../ui/placeBuildingService';
import {util} from '../util';
import {GameLoop} from './game-loop';
import {GameSpeed} from './game-speed';
import {GameCamera} from './game-camera';
import {gameClock} from './game-clock';
import {Tilemap} from '../tilemap';
import {spriteManager} from '../services/sprite-manager';
import {IRowColumnCoordinates} from '../interfaces';
import {gameLevelFactory} from '../data/gameLevelFactory';
import {keybindings} from '../services/keybindings';
import {GameComponent} from '../views/game';
import {TileInfoService} from '../ui/TileInfoService';
import {constants} from '../data/constants';

const defaultLevel = gameLevelFactory.getDefaultRegularLevel();

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
            this.state.start(State.Game);
            this.saveLastOpenedLevel(level);
        });
        events.on('game-start', () => this.start());
        events.on('game-destroy', () => this.destroy());

        this.state = new StateManager(rootElement);
        this.bootstrapGameStates();

        this.entityManager = new EntityManager();
        placeBuildingService.setEntityManager(this.entityManager);
        placeBuildingService.setEntitySpawner(this.entityManager.spawner);
        window['entityManager'] = this.entityManager;

        new TileInfoService(this.entityManager);

        // create a renderer instance.
		this.renderer = new PIXI.WebGLRenderer(windowSize.width, windowSize.height, {
			antialias: false
		});
        canvasService.instantiateCanvas(this.renderer.view);
        this.stage = new PIXI.Container();

        let seeds = [0.663345, 0.8908902304];
		seeds = seeds.slice(0, 1);

        this.seed = Math.random();
		// this.seed = util.randomFromList(seeds) || Math.random();

        this.loop = new GameLoop();
		this.loop.on('update', (turn: number, stopped: boolean) =>
            this.update(turn, stopped));

        new GameSpeed(this.loop);

        this.camera = new GameCamera();

        this.startRenderer();

        this.level = defaultLevel;

        if (mode === 'mapgen') {
            this.state.start(State.Preload, State.Game);
        } else if (mode === 'default') {
            this.state.start(State.Preload, State.MainMenu);
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

        // Spawn player town
        this.entityManager.spawner.spawnTown();

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
        if (this.level.agents) {
            this.level.agents.forEach(agent => {
                this.entityManager.spawner.spawnAgent(
                    agent.enum,
                    agent.villager,
                    agent.data
                );
            });
        }

        // Spawn items
        if (this.level.items) {
            this.level.items.forEach(itemData => {
                const count = itemData.count || 1;
                for (let i = 0; i < count; i++) {
                    this.entityManager.spawner.spawnItem(
                        itemData.enum,
                        _.extend(itemData.data, {
                            item: {
                                claimed: !!this.level.itemsClaimed
                            }
                        })
                    );
                }
            });
        }

        // Spawn buildings
        if (this.level.buildings) {
            this.level.buildings.forEach(building => {
                this.entityManager.spawner.spawnBuilding(
                    building.enum,
                    building.isCompleted,
                    building.storage,
                    building.data);
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
		this.state.add(State.Preload, PreloaderState);
		this.state.add(State.MainMenu, MainMenuState);
		this.state.add(State.Game, GameState);
		this.state.add(State.TestSelect, TestSelectState);
	};
}