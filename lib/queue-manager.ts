import { SongProps } from "../audio/audio";

export interface QueueData extends SongProps {
	id: number;
}

export interface QueueManagerOptions {
	onUpdate?: (song: QueueData | undefined) => void;
	onSongListUpdated?: (song: QueueData[]) => void;
}

export interface QueueManager {
	currentSong: number;
	songs: QueueData[];

	getPendingSong(): QueueData[];
	getCurrentSong(): QueueData | undefined;
	setIndex: (id: number) => void;
	setSongs: (song: SongProps[]) => void;

	next(): void;
	previous(): void;
}

export function createQueueManager(options: QueueManagerOptions): QueueManager {
	return {
		currentSong: 0,
		songs: [],

		setSongs(songs: SongProps[]) {
			this.songs = songs.map((song, id) => ({ ...song, id: id }));

			this.setIndex(this.currentSong === -1 ? 0 : this.currentSong);

			// fire updates
			options.onUpdate?.(this.getCurrentSong());
			options.onSongListUpdated?.(this.songs);
		},

		getPendingSong() {
			return this.songs.slice(this.currentSong + 1);
		},

		getCurrentSong() {
			return this.songs[this.currentSong];
		},
		setIndex(id) {
			let target: number;

			if (this.songs.length === 0) target = -1;
			else if (id > this.songs.length) target = 0;
			else if (id < 0) target = this.songs.length - 1;
			else target = id;

			if (this.currentSong === target) return;
			this.currentSong = target;
			options.onUpdate?.(this.getCurrentSong());
		},

		next() {
			return this.setIndex(this.currentSong + 1);
		},

		previous() {
			return this.setIndex(this.currentSong - 1);
		},
	};
}
