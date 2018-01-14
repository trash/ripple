import {events} from '../events';
import {Agent} from '../data/Agent';
import {visitorUtil} from '../entity/util/visitor';

export class VisitorService {
    updateInterval = 1000;
    private removeEventListener: Function;

    constructor() {
        const update = () => this.update();
        events.on('clock.hour', update);
        this.removeEventListener = () => events.off('clock.hour', update);
    }

    destroy(): void {
        this.removeEventListener();
    }

    private update(): void {
        if (this.shouldSpawnVisitor()) {
            this.spawnVisitor();
        }
    }

    private shouldSpawnVisitor(): boolean {
        // Right now just spawn a visitor when there are none
        const visitors = visitorUtil.getAllVisitors();
        return !visitors.length;
    }

    /**
     * Decide on a visitor to spawn and spawn it
     */
    private spawnVisitor(): number {
        const visitorId = visitorUtil.spawnVisitor(Agent.Visitor);
        return visitorId;
    }
}