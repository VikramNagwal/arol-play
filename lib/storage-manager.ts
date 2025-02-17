import defaultSongs from '../audio/audio.json';
import { SongProps } from '../audio/audio';
import { logger } from '../lib/logger';


export interface StorageManager {
  getCustomSongs(): SongProps[];
  loadSongs(): SongProps[];
  saveCustomSongs(songs: SongProps[]): void;
}

type Storage = {
    custom_songs: SongProps[];
};

export function createStorageManager(): StorageManager {
    return {
        saveCustomSongs(songs: SongProps[]) {
            localStorage.setItem('custom_songs', JSON.stringify(songs))
            logger.success("custom song saved")
        },
        getCustomSongs() {
            const customSongs = localStorage.getItem('custom_songs')
            if (customSongs) {
                return JSON.parse(customSongs) as Storage['custom_songs'];
            }
            return []
        },
        loadSongs() {
            const allSongs = [...defaultSongs, ...this.getCustomSongs()];
            return allSongs.map(song => ({
                ...song,
                artist: song.artist || 'Unknown Artist'
            }));
        },
    }
}