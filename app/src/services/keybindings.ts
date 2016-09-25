import _ = require('lodash');

const ignoredElements = {
    'INPUT': true
};

var pressedDown = {}, combos = {};

let getCurrentCombos = function () {
    // For now just return two copies. original with '+'s and one reversed
    return [
        Object.keys(pressedDown).join('+'),
        Object.keys(pressedDown).reverse().join('+')
    ];
};
let comboMatch = function () {
    return getCurrentCombos().filter(function (combo) {
        return combo in combos;
    });
};

interface IKeyToKeyCodeMap {
    [index: string]: number;
}

// List of keys mapped to keyCodes
const keyMap : IKeyToKeyCodeMap = {
    ctrl: 17,
    escape: 27,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    f: 70,
    g: 71,
    h: 72,
    j: 74,
    m: 77,
    n: 78,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    space: 32,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    '=': 187,
    '-': 189,
    // `
    menu: 192,
    '[': 219,
    ']': 221
};
let invertedKeyMap = _.invert(keyMap);

interface IKeyBindingMap {
    [index: string]: Array<(event: Event) => void>;
}

class Keybindings {
    keys: IKeyBindingMap;
    keyMap: IKeyToKeyCodeMap;
    upListener: () => void;
    downListener: () => void;

    constructor() {
        this.keys = {};
        this.keyMap = keyMap;
        this.upListener = this._upListener.bind(this);
        this.downListener = this._downListener.bind(this);
    }
    /**
     * Binds a callback to a keypress
     *
     * @param {String|Number} key Number, letter, or word associated with a key
     * @param {Function} callback Callback to call each time the key is pressed
     */
    addKeyListener (key: string, callback: () => void) {
        if (key.length > 1 && key.indexOf('+') !== -1) {
            combos[key] = callback;
            return;
        }
        var keyCode = keyMap[key];
        if (!this.keys[keyCode]) {
            this.keys[keyCode] = [];
        }
        this.keys[keyCode].push(callback);
    }

    /**
     * Turns the keybindings service on so it listens to all key ups
     */
    on () {
        window.addEventListener('keydown', this.downListener);
        window.addEventListener('keyup', this.upListener);
    }

    /**
     * Turns off the keybinding service's upListener
     */
    off () {
        window.removeEventListener('keydown', this.downListener);
        window.removeEventListener('keyup', this.upListener);
    }

    _downListener (event) {
        pressedDown[invertedKeyMap[event.keyCode]] = true;
        var matches = comboMatch();
        // console.log(matches);
        if (matches.length) {
            combos[matches[0]]();
        }
    }

    /**
     * The upListener that fires off the appropriate keypress callback
     *
     * @param {Object} event The keypress event
     */
    _upListener (event) {
        // Make sure inputs and stuff when focused and being typed into don't call this
        if (event.target.nodeName in ignoredElements) {
            return;
        }
        delete pressedDown[invertedKeyMap[event.keyCode]];
        if (event.keyCode in this.keys) {
            this.keys[event.keyCode].forEach(callback => {
                callback(event);
            });
        }
    }

};

export let keybindings = new Keybindings();