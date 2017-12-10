import * as Immutable from 'immutable';
import {connect} from 'react-redux';
import {StoreState} from '../../redux/store';
import * as React from 'react';
import {itemUtil} from '../../entity/util';
import {Item} from '../../data/Item';

export interface EconomyViewProps {
}

export class EconomyView extends React.Component<EconomyViewProps, object> {
    render () {
        return (
            <div>
                <h1>Economy View</h1>
            </div>
        );
    }
}

export const ConnectedEconomyView = connect((state: StoreState) => {
    return {

    };
}, function(){return{}} as any)(EconomyView);