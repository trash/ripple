import * as Immutable from 'immutable';
import * as React from 'react';
import {Provider, connect} from 'react-redux';
import {store, StoreState} from '../../redux/store';
import {
    IVisitorState
} from '../../entity/components';
import {visitorUtil} from '../../entity/util';
import {Item} from '../../data/Item';

export interface RecruitVisitorSectionProps {
    visitorId: number;
    visitor: IVisitorState;
    claimedItemList: Immutable.Map<Item, number>;
}

export class RecruitVisitorSection extends React.Component<RecruitVisitorSectionProps, void> {
    render() {
        this.props.visitor.recruitState.setItemList(this.props.claimedItemList);
        return (
        <div className="recruit-visitor-section">
            <div>Recruit Cost:</div>
            <div>{this.props.visitor.recruitState.toString()}</div>
            <button onClick={() => visitorUtil.recruit(this.props.visitorId)}
                disabled={!this.props.visitor.recruitState.itemListContainsRequiredResources(this.props.claimedItemList)}>
                Recruit
            </button>
        </div>
        );
    }
}

export const ConnectedRecruitVisitorSection= connect((state: StoreState) => {
    return {
        claimedItemList: state.claimedItems
    };
})(RecruitVisitorSection) as any;