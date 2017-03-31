import * as React from 'react';
import {AgentListEntry} from '../../interfaces';
import {agentUtil} from '../../entity/util';
import {Agent} from '../../data/Agent';

export const AgentInfoCard = (selectedAgent: AgentListEntry) => {
        if (!selectedAgent) {
            return null;
        }
        return (
            <div className="agent-info-card">
                <div>Id: {selectedAgent.id}</div>
                <div>
                    <img src={agentUtil.getImagePath(selectedAgent.agent.enum)}/>
                </div>
                <div>Agent Type: {Agent[selectedAgent.agent.enum]}</div>
                <div>Gender: {selectedAgent.agent.gender}</div>
                <div>Speed: {selectedAgent.agent.speed}</div>
                <div>Strength: {selectedAgent.agent.strength}</div>
            </div>
        );
    }
}