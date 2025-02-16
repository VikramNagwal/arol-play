import {
	createQueueManager,
	QueueData,
	QueueManager,
	QueueManagerOptions,
} from "./queue-manager";
import { SongProps } from "../audio/audio.d";
import { logger } from "./logger";
import { createStorageManager, StorageManager } from "./storage-manager";

export interface MusicManager {
	queueManager: QueueManager;
	storageManager: StorageManager;
	analyser: AnalyserNode;

	play(): void;
	pause(): void;
	setPlaying(song: SongProps): void;
	clear(): void;

	isPaused(): boolean;
	getTime(): number;
	getDuration(): number;
	setTime(time: number): void;

	getVolume(): number;
	setVolume(volume: number): void;
}

export interface MusicManagerOptions
	extends Omit<QueueManagerOptions, "onUpdate"> {
	onNext: (song: QueueData | undefined) => void;
	onStateChange?: () => void;
	onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export const createMusicManager = ({
	onSongListUpdated,
	...options
}: MusicManagerOptions) => {
	const context = new AudioContext();
	const analyser = context.createAnalyser();
	const audio = new Audio();

	const onStateChange = () => {
		return options.onStateChange?.();
	};

	const onTimeUpdate = () => {
		return options.onTimeUpdate?.(audio.currentTime, audio.duration);
	};

	const onEnded = () => {
		manager.queueManager.next();
		manager.play();
	};

	const storageManager = createStorageManager();
	const queueManager = createQueueManager({
		onUpdate: (song) => {
			if (song) {
				manager.setPlaying(song);
				options?.onNext?.(song);
				options?.onTimeUpdate?.(0, 0);
			}
		},
		onSongListUpdated,
	});

	const init = () => {
		const source = context.createMediaElementSource(audio);
		source.connect(analyser);
		analyser.connect(context.destination);

		audio.addEventListener("timeupdate", onTimeUpdate);
		audio.addEventListener("play", onStateChange);
		audio.addEventListener("pause", onStateChange);
		audio.addEventListener("ended", onEnded);
		queueManager.setSongs(storageManager.loadSongs());
	};

	const manager: MusicManager = {
		queueManager,
		storageManager,
		analyser,

		getDuration(): number {
			return audio.duration;
		},
		getTime(): number {
			return audio.currentTime;
		},
		setTime(time: number): void {
			audio.currentTime = time;
			return logger.success("Time set to " + time);
		},
		isPaused(): boolean {
			return context.state === "suspended" || (audio != null && audio.paused);
		},
		getVolume(): number {
			return audio.volume;
		},
		setVolume(v: number) {
			audio.volume = v;
			return logger.success("Volume set to " + v);
		},

		async play() {
			// When AudioContext is initialized before the first interaction, it is suspended
			// we have to resume it
			if (context.state === "suspended") await context.resume();
			await audio.play();
		},

		pause() {
			void audio.pause();
			logger.success("Music paused");
		},

		setPlaying(song) {
			const wasPlaying = !this.isPaused();
			audio.src = song.url;

			if (wasPlaying) {
				this.play();
			}
		},

		clear() {
			this.pause();
			audio.removeEventListener("play", onStateChange);
			audio.removeEventListener("pause", onStateChange);
			audio.removeEventListener("timeupdate", onTimeUpdate);
			audio.removeEventListener("ended", onEnded);
		},
	};

	init();

	return manager;
};