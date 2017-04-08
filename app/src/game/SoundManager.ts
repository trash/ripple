import {util} from '../util';
import {events} from '../events';
import {sounds} from './sounds';
import {ISoundDataList} from '../interfaces';

const audioDir = 'audio/effects/';
const defaultThrottle = 1000;

interface ITriggerSoundOptions {
	playbackRate?: number;
	volume?: number;
}

interface IThrottleMap {
	[index: string]: number;
}

export class SoundManager {
	sounds: ISoundDataList;
	loadedSounds: any;
	throttleMap: IThrottleMap;
	mutedOnGameStart: boolean;

	constructor () {
		let soundManager = this;

		this.mutedOnGameStart = true;

		this.sounds = sounds;

		this.loadedSounds = {};
		this.throttleMap = {};

		events.on(['trigger-sound', '*'], function (options: ITriggerSoundOptions) {
			soundManager.trigger(this.event[1], options);
		});
	}

	unmuteOnGameStart () {
		this.mutedOnGameStart = false;
	}

	shouldThrottle (name: string): boolean {
		if (name in this.throttleMap) {
			return true;
		}
		this.throttleMap[name] = setTimeout(() => {
			delete this.throttleMap[name];
		}, this.sounds[name].throttle || defaultThrottle);
		return false;
	};

	trigger (name: string, options: ITriggerSoundOptions = {}) {
		let soundEntry = this.sounds[name];
		if (soundEntry.muteOnGameStart && this.mutedOnGameStart) {
			return;
		}

		let sound = util.randomFromList(soundEntry.list);
		if (this.shouldThrottle(name)) {
			return;
		}

		let audio: HTMLAudioElement = this.loadedSounds[sound]
            || new Audio(audioDir + sound);
		this.loadedSounds[sound] = audio;

		if (options.playbackRate) {
			audio.playbackRate = options.playbackRate;
		}
		if (options.volume) {
			audio.volume = options.volume;
		}

		audio.play();
	};
};

export let soundManager = new SoundManager();