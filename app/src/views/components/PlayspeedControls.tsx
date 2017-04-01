import {events} from '../../events';
import * as React from 'react'
import {connect} from 'react-redux';
import {store, StoreState} from '../../redux/store';
import {GameSpeed, SpeedUpEvent, SlowDownEvent} from '../../game/GameSpeed';
import {PlayPauseEvent} from '../../game/GameLoop';

export interface PlayspeedControlsProps {
    playPauseGame: () => any;
    slowGameSpeed: () => any;
    speedUpGameSpeed: () => any;
    gameSpeed: number;
    gamePaused: boolean;
}

export class PlayspeedControls extends React.Component<PlayspeedControlsProps, void> {
    render() {
        let playPauseClass = 'fa';
        playPauseClass += this.props.gamePaused
            ? 'fa-play'
            : 'fa-pause';
        return (
        <div className="playspeed-controls">
			<button onClick={ () => this.props.playPauseGame() }>
				<i className={ playPauseClass }></i>
                Play/Pause
			</button>
            <button
                onClick={ () => this.props.slowGameSpeed() }
                disabled={ this.props.gameSpeed === 0 }>
                <i className="fa fa-backward"></i>
                Slow Down
            </button>
            <button
                onClick={ () => this.props.speedUpGameSpeed() }
                disabled={ this.props.gameSpeed === GameSpeed.speeds.length - 1 }>
                <i className="fa fa-forward"></i>
                Speed Up
            </button>
            <button
                className="speed-multiplier"
                disabled={true}>x{ this.props.gameSpeed + 1 }</button>
        </div>
        );
    }
}

export const ConnectedPlayspeedControls = connect((state: StoreState) => {
    return {
        playPauseGame: () => events.emit(PlayPauseEvent),
        slowGameSpeed: () => events.emit(SlowDownEvent),
        speedUpGameSpeed: () => events.emit(SpeedUpEvent),
        gameSpeed: state.gameSpeed,
        gamePaused: state.gamePaused
    };
})(PlayspeedControls);