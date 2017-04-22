import * as React from 'react';
import {Provider, connect} from 'react-redux';
import {store, StoreState} from '../../redux/store';
import {collisionUtil} from '../../entity/util';
import {IRowColumnCoordinates} from '../../interfaces';
import {globalRefs} from '../../globalRefs';

interface CollisionDebugViewProps {
    show: boolean;
}

type IdsAndTiles = {
    id: number,
    tiles: IRowColumnCoordinates[]
};

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
        const idsAndTiles: IdsAndTiles[] = ids.map(id => {
            const tiles = collisionUtil.getTilesFromCollisionEntity(id, true);
            return {
                id,
                tiles
            };
        });

        return (
        <div>{idsAndTiles.map(idAndTiles => {
            return idAndTiles.tiles.map(tile => {
                const elementPosition = globalRefs.map
                    .getElementPositionFromTile(tile);
                return <div className="hover-tile"
                    key={`${idAndTiles.id}-${tile.row * 1000 + tile.column}`}
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

export const ConnectedCollisionDebugView= connect((state: StoreState) => {
    return {
        show: state.showCollisionDebug
    };
})(CollisionDebugView);