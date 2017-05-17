import * as _ from 'lodash';
import {util} from '../../util';
import {EntitySystem, EntityManager} from '../entityManager';
import {Component} from '../ComponentEnum';
import {
    IBuildingState,
    IRenderableState,
    IPositionState,
    IConstructibleState,
    IHealthState,
    INameState,
    ICollisionState,
    IStorageState,
    IShopState
} from '../components';
import {mapUtil, buildingUtil} from '../util';
import {Building} from '../../data/Building';

export class BuildingSystem extends EntitySystem {
    update (entityIds: number[]) {
        entityIds.forEach(id => {
            const buildingState = this.manager.getComponentDataForEntity(
                Component.Building, id) as IBuildingState;
            const positionState = this.manager.getComponentDataForEntity(
                Component.Position, id) as IPositionState;
            const healthState = this.manager.getComponentDataForEntity(
                Component.Health, id) as IHealthState;
            const nameState = this.manager.getComponentDataForEntity(
                Component.Name, id) as INameState;
            const constructibleState = this.manager.getComponentDataForEntity(
                Component.Constructible, id) as IConstructibleState;
            const renderableState = this.manager.getComponentDataForEntity(
                Component.Renderable, id) as IRenderableState;
            const collisionState = this.manager.getComponentDataForEntity(
                Component.Collision, id) as ICollisionState;
            const storageState = this.manager.getComponentDataForEntity(
                Component.Storage, id) as IStorageState;
            const shopState = this.manager.getComponentDataForEntity(
                Component.Shop, id) as IShopState;

            buildingUtil.buildingInitChecks(
                buildingState,
                renderableState,
                constructibleState,
                positionState,
                collisionState,
                storageState,
                shopState,
                nameState
            );
        });
    }


}