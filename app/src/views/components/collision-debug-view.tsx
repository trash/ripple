import * as React from 'react';
import {collisionUtil} from '../../entity/util/collision';
import {IRowColumnCoordinates} from '../../interfaces';
import {events} from '../../events';
import {GameMap} from '../../map';

const globalRefs: {
	map: GameMap
} = {
	map: null
};
events.on('map-update', (map: GameMap) => {
	globalRefs.map = map;
});

interface CollisionDebugViewProps {
    show: boolean;
}

export class CollisionDebugView extends React.Component<CollisionDebugViewProps, void> {
    componentWillMount () {
        setInterval(() => {
            if (!this.props.show) {
                return;
            }
            this.render();
        }, 5);
    }
    render () {
        if (!this.props.show) {
            return null;
        }
        const ids = collisionUtil.getAllCollisionEntities();
        const tiles = ids.reduce((tiles, id) => {
            return tiles.concat(collisionUtil.getTilesFromCollisionEntity(id, true));
        }, [] as IRowColumnCoordinates[]);

        return (
            <div>{tiles.map(tile => {
                const elementPosition = globalRefs.map.getElementPositionFromTile(tile);
                return <div className="hover-tile"
                    key={tile.row * 1000 + tile.column}
                    style={{
                        display: 'block',
                        top: elementPosition.top,
                        left: elementPosition.left
                    }}/>
            })}</div>
        );
    }
}