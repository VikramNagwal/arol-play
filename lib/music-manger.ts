import { QueueManager, QueueManagerOptions } from "./queue-manager";
import { SongProps } from "../audio/audio.d";

export interface MusicManager {
	queueManager: QueueManager;

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
