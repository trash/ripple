import * as React from 'react';
import {dataList as buildingsList} from '../../entity/assemblageData/buildings';
import {buildingUtil} from '../../entity/util/building';
import {IEntityComponentData} from '../../interfaces';
import {placeBuildingService} from '../../ui/placeBuildingService';

const onBuildingClick = (buildingData: IEntityComponentData) => {
    placeBuildingService.toggle(buildingData);
}

export class BuildingsList extends React.Component<void, void> {
    render() {
        return (
        <ul className="buildings-list">
        { buildingsList.map(buildingData => {
            const name = buildingData.building.name;
            return (
            <li key={name}
                onClick={() => onBuildingClick(buildingData)}>
                <img src={buildingUtil.getImagePath(name)}/>
                <p>{name}</p>
            </li>
            );
        })}
        </ul>
        );
    }
}