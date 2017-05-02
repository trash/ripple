import * as React from 'react';
import {dataList as buildingsList} from '../../entity/assemblageData/buildings';
import {buildingUtil} from '../../entity/util/building';
import {IEntityComponentData} from '../../interfaces';
import {placeBuildingService} from '../../ui/placeBuildingService';

const onBuildingClick = (buildingData: IEntityComponentData) => {
    placeBuildingService.toggle(buildingData);
}

export class SpawnBuildingList extends React.Component<void, void> {
    render() {
        return (
        <ul className="buildings-list">
        { buildingsList.map(buildingData => {
            const building = buildingData.building.enum;
            return (
            <li key={building}
                onClick={() => onBuildingClick(buildingData)}>
                <img src={buildingUtil.getImagePath(building)}/>
                <p>{name}</p>
            </li>
            );
        })}
        </ul>
        );
    }
}