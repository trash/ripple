import * as React from 'react';
import {connect} from 'react-redux';
import {StoreState} from '../../redux/store';

export interface ClockProps {
    hours: number;
    days: number;
}

export class Clock extends React.Component<ClockProps, object> {
    render () {
        return (
            <div className="clock">
                Day: {this.props.days} Hour: {this.props.hours}
            </div>
        );
    }
}

export const ConnectedClock = connect((state: StoreState) => {
    return {
        days: state.days,
        hours: state.hours
    };
}, function () {} as any)(Clock);