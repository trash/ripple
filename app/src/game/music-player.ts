import {events} from '../events';

export class MusicPlayer {
	songs: string[];
	songIndex: number;
	song: HTMLAudioElement;
	volume: number;

	constructor (songs) {
		this.songs = songs;
		this.songIndex = 0;
		this.song = null;
		this.volume = 1;

		if (localStorage.getItem('volume')) {
			this.volume = parseInt(localStorage.getItem('volume'));
		}

		events.on('volume-change', (volume) => {
			this.song.volume = volume;
			localStorage.setItem('volume', volume);
			this.volume = volume;
		});

		this.playNext();
	}

	playNext () {
		this.song = new Audio(this.songs[this.songIndex]);

		this.song.volume = this.volume;
		this.song.onended = this.playNext.bind(this);

		this.song.play();

		this.songIndex++;
		// Make sure it loops around to beginning
		if (this.songIndex > this.songs.length-1) {
			this.songIndex = 0;
		}
	};
};