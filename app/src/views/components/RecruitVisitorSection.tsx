import * as Immutable from 'immutable';
import * as React from 'react';
import {Provider, connect} from 'react-redux';
import {store, StoreState} from '../../redux/store';
import {
    IVisitorState
} from '../../entity/components';
import {visitorUtil} from '../../entity/util';
import {Item} from '../../data/Item';

interface RecruitVisitorSectionProps {
    visitorId: number;
    visitor: IVisitorState;
}

interface InnerProps extends RecruitVisitorSectionProps {
    claimedItemList: Immutable.Map<Item, number>;
}

class Inner extends React.Component<InnerProps, void> {
    render() {
        if (!this.props.visitor.recruitCost) {
            return null;
        }

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

const ConnectedInner= connect((state: StoreState) => {
    return {
        claimedItemList: state.claimedItems
    };
})(Inner);

// We do this so we can pass down the required props but still have redux supply
// claimedItemList
export class RecruitVisitorSection extends React.Component<RecruitVisitorSectionProps, void> {
    render() {
        return <ConnectedInner {...this.props as any}/>
    }
}