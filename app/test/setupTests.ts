interface MockWindow {
    localStorage: LocalStorageMock;
    performance: PerformanceMock;
}
var mockWindow: MockWindow = window as any;

class LocalStorageMock {
    store: any;

    constructor() {
        this.store = {};
    }

    clear(): void {
        this.store = {};
    }

    getItem(key: string): any {
        return this.store[key];
    }

    setItem(key: string, value: any): void {
        this.store[key] = value.toString();
    }
}

class PerformanceMock {
    now(): number {
        return Date.now();
    }
}

mockWindow.localStorage = new LocalStorageMock();
mockWindow.performance = new PerformanceMock();
