import * as React from 'react';
import {collisionUtil} from '../../entity/util';
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

type IdsAndTiles = [number, IRowColumnCoordinates[]];

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
        const ids = collisionUtil.getAllCollisionEntities()
            // Filter down to just the ones that aren't ignored
            .filter(id => {
                return collisionUtil._getCollisionState(id).updatesTile;
            });
        const idsAndTiles = ids.map(id => {
            const tiles = collisionUtil.getTilesFromCollisionEntity(id, true);
            return [
                id,
                tiles
            ];
        });

        return (
        <div>{idsAndTiles.map(([id, tiles]) => {
            return (tiles as IRowColumnCoordinates[]).map(tile => {
                const elementPosition = globalRefs.map
                    .getElementPositionFromTile(tile);
                return <div className="hover-tile"
                    key={`${id}-${tile.row * 1000 + tile.column}`}
                    style={{
                        display: 'block',
                        top: elementPosition.top,
                        left: elementPosition.left
                    }}/>
            })
        })}</div>
        );
    }
}