import * as React from 'react';

export function AutoUpdate<P>(
    WrappedComponent: new () => React.Component<P, any>,
    updateInterval: number
) {
    return class extends React.Component<P, any> {
        autoUpdateIntervalId: number;

        componentWillMount() {
            this.autoUpdateIntervalId = setInterval(() => {
                this.forceUpdate();
            }, updateInterval);
        }

        componentWillUnMount() {
            clearInterval(this.autoUpdateIntervalId);
        }

        render() {
            return (
                <WrappedComponent {...this.props as any}/>
            );
        }
    }
}