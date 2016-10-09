import {ComponentEnum} from '../component-enum';
import {spriteUtil} from '../../util/sprite';
import {BaseUtil} from './base';
import {positionUtil} from './position';
import {MapUtil} from '../../map/map-util';

export class AgentUtil extends BaseUtil {
    attackAgent (attacker: number, target: number): boolean {
        const healthState = this._getHealthState(target),
            agentState = this._getAgentState(attacker),
            targetRenderableState = this._getRenderableState(target),
            targetHealthBarState = this._getHealthBarState(target),
            attackerPositionState = this._getPositionState(attacker),
            targetPositionState = this._getPositionState(target);

        const distanceToTarget = MapUtil.distanceTo(attackerPositionState.tile,
            targetPositionState.tile, true);
		if (distanceToTarget > 1) {
            return false;
        }

        // Face the target
        attackerPositionState.direction = positionUtil.directionToTile(
            attackerPositionState.tile,
            targetPositionState.tile);

        const damage = agentState.strength;

        // Reduce health
        healthState.currentHealth -= damage;

        spriteUtil.showDamageNumber(targetRenderableState.spriteGroup, damage + '', 12, -12);

        // Show health bar then hide it
        targetHealthBarState.shown = true;
        setTimeout(() => {
            targetHealthBarState.shown = false;
        }, 5000);

        return true;
    }
}

export const agentUtil = new AgentUtil();