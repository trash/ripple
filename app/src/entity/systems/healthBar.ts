import * as _ from 'lodash';;
import {EntitySystem, EntityManager} from '../entityManager';
import {Component} from '../ComponentEnum';
import {IHealthState} from '../components';
import {IHealthBarState} from '../components';
import {IRenderableState} from '../components';
import {util} from '../../util';
import {events} from '../../events';
import {constants} from '../../data/constants';
import {SpriteManager} from '../../services/spriteManager';

const healthBarAutoHideTime = 1000;

export class HealthBarSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const renderableState = this.manager.getComponentDataForEntity(
                Component.Renderable, id) as IRenderableState;
            const healthState = this.manager.getComponentDataForEntity(
                Component.Health, id) as IHealthState;
            const healthBarState = this.manager.getComponentDataForEntity(
                Component.HealthBar, id) as IHealthBarState;

            if (renderableState.spriteGroup && !healthBarState.sprites) {
                this.initSprites(healthBarState, renderableState);
            }
            // Update the percentageFilled based on the current health
            healthBarState.percentageFilled = healthState.currentHealth / healthState.maxHealth;

            // Always show the healthbar for damaged things
            if (healthBarState.percentageFilled < 1 && !healthBarState.shown) {
                healthBarState.shown = true;
                clearTimeout(healthBarState.autoHideTimeout);
                healthBarState.autoHideTimeout = null;
            // Autohide healthbars with full health
            } else {
                if (!healthBarState.autoHideTimeout) {
                    healthBarState.autoHideTimeout = setTimeout(() => {
                        healthBarState.shown = false;
                        healthBarState.autoHideTimeout = null;
                    }, healthBarAutoHideTime);
                }
            }

            this.updateHealthBar(healthBarState);
        });
    }

    updateHealthBar (healthBarState: IHealthBarState) {
        if (!healthBarState.sprites) {
            return;
        }

        const currentHealthBarIndex = Math.floor(healthBarState.size * healthBarState.percentageFilled);
        for (let i = 0; i < healthBarState.sprites.length; i++) {
            let visible = false;
            if (healthBarState.shown && i === currentHealthBarIndex) {
                visible = true;
            }
            healthBarState.sprites[i].visible = visible;
        }
    }

    initSprites (healthBarState: IHealthBarState, renderableState: IRenderableState) {
        const size = healthBarState.size;
        healthBarState.sprites = [];
        for (let i = 0; i < size + 1; i++) {
			const healthBar = SpriteManager.Sprite.fromFrame(`health-bar-${i}-${size}`);
			healthBar.position.x = healthBarState.positionX;
			healthBar.position.y = healthBarState.positionY;
			healthBar.visible = false;
            healthBarState.sprites.push(healthBar);
			renderableState.spriteGroup.addChild(healthBar);
		}
    }
}