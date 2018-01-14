import * as Immutable from 'immutable';
import {connect} from 'react-redux';
import * as React from 'react';

import {AgentListEntry} from '../../interfaces';
import {StoreState} from '../../redux/store';
import {agentUtil, healthUtil} from '../../entity/util';
import {Item} from '../../data/Item';
import {ItemProperty} from '../../data/ItemProperty';

export interface EconomyViewProps {
    villagers: AgentListEntry[];
}

export class EconomyView extends React.Component<EconomyViewProps, object> {
    render () {
        return (
            <div>
                <div>
                {this.props.villagers.map(agentEntry => {
                    // console.log(agentEntry);
                    return (
                        <div className="entity-list-entry"
                            // onClick={() => this.selectEntity(agentEntry.id)}
                            key={agentEntry.id}
                        >
                            <div className="name-column">{agentEntry.name.name}</div>
                            <div className="sprite-column">
                                <img src={agentUtil.getImagePathFromAgentState(agentEntry.agent)}/>
                            </div>
                            <div className="health-column">Has bought an item: {agentEntry.visitor.boughtItem ? 'yes' : 'no'}</div>
                            <div className="health-column">Desired items:</div>
                            <ul>
                                {agentEntry.visitor.desiredItems.map(item => {
                                    return <li key={item}>{ItemProperty[item]}</li>
                                })}
                            </ul>
                            <div className="health-column">Bought items:</div>
                            <ul>
                                {Object.keys(agentEntry.visitor.itemsBought).map(item => {
                                    const itemEnum = parseInt(item);
                                    const count = agentEntry.visitor.itemsBought[item];

                                    return <li key={itemEnum}>{Item[itemEnum]}: {count}</li>
                                })}
                            </ul>
                        </div>
                    );
                })}
                </div>
            </div>
        );
    }
}

export const ConnectedEconomyView = connect((state: StoreState) => {
    const villagers = state.agentsList.filter(agent => !!agent.visitor).toArray();

    return {
        villagers
    };
}, function(){return{}} as any)(EconomyView);
