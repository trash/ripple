import * as React from 'react';
import {dataList as buildingsList} from '../../entity/assemblageData/buildings';
import {buildingUtil} from '../../entity/util/building';

export class BuildingsList extends React.Component<void, void> {
    render() {
        return (
        <ul className="buildings-list">
        { buildingsList.map(buildingData => {
            const name = buildingData.building.name;
            return (
            <li key={name}>
                <img src={buildingUtil.getImagePath(name)}/>
                <p>{name}</p>
            </li>
            );
        })}
        </ul>
        );
    }
}