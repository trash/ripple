import {Agent} from '../data/Agent';
import {visitorUtil} from '../entity/util/visitor';

export class VisitorService {
    updateInterval = 1000;
    private intervalId: number;

    constructor() {
        this.intervalId = setInterval(() => this.update(), this.updateInterval);
    }

    destroy(): void {
        clearInterval(this.intervalId);
    }

    private update(): void {
        const visitors = visitorUtil.getAllVisitors();
        // Right now just spawn a visitor when there are none
        if (!visitors.length) {
            this.spawnVisitor();
        }
    }

    /**
     * Decide on a visitor to spawn and spawn it
     */
    private spawnVisitor(): void {
        const visitorId = visitorUtil.spawnVisitor(Agent.Visitor);
    }
}