import * as React from 'react';
import {dataList as buildingsList} from '../../entity/assemblageData/buildings';
import {buildingUtil} from '../../entity/util/building';
import {IEntityComponentData} from '../../interfaces';
import {placeBuildingService} from '../../ui/placeBuildingService';

export class BuildingsList extends React.Component<void, void> {
    onBuildingClick (buildingData: IEntityComponentData) {
        placeBuildingService.toggle(buildingData);
    }

    render() {
        return (
        <ul className="buildings-list">
        { buildingsList.map(buildingData => {
            const name = buildingData.building.name;
            return (
            <li key={name}
                onClick={() => this.onBuildingClick(buildingData)}>
                <img src={buildingUtil.getImagePath(name)}/>
                <p>{name}</p>
            </li>
            );
        })}
        </ul>
        );
    }
}