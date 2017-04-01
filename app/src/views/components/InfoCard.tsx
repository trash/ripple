import * as React from 'react';
import {MapUtil} from '../../map/map-util';
import {healthUtil} from '../../entity/util';

import {
    IVillagerState,
    IAgentState,
    IVisitorState,
    IPositionState,
    IHealthState
} from '../../entity/components';

export type DisplayProperty = {
    name: string;
    value: string | number;
    detailedOnly: boolean;
}

export const filterAndRenderProperties = (
    detailed: boolean, properties: DisplayProperty[]
): JSX.Element[] => {
    return properties
        .filter(displayProperty => detailed || !displayProperty.detailedOnly)
        .map(displayProperty =>
            <div key={displayProperty.name}>
                {displayProperty.name}: {displayProperty.value}
            </div>
        );
};

export const renderHealthProperties = (healthState: IHealthState): DisplayProperty[] => [
    {
        name: 'Health',
        value: healthUtil.toString(healthState),
        detailedOnly: false
    }
];

export const renderPositionProperties = (positionState: IPositionState): DisplayProperty[] => [
    {
        name: 'Tile',
        value: MapUtil.tileToString(positionState.tile),
        detailedOnly: false
    },
];
