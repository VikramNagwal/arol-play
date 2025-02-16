import { MusicManager } from "./music-manger";

export interface ShortcutManagerOptions {
    musicManager: MusicManager;
}

export interface ShortcutManager {
    bind(): void;
    clear(): void;
    onPress(e: KeyboardEvent): void;
}

export function createShortcutManager( musicManager: ShortcutManagerOptions): ShortcutManager {
    return {
        bind() {
            document.addEventListener("keydown", this.onPress);
        },
        clear() {
            document.removeEventListener("keydown", this.onPress);
        },
        onPress(e) {
            if (e.target instanceof HTMLInputElement) {
                return;
            }
            if (e.key === " ") {
                if (musicManager.musicManager.isPaused()) {
                    musicManager.musicManager.play();
                } else {
                    musicManager.musicManager.pause();
                }
            } else if (e.key === "ArrowRight") {
                musicManager.musicManager.queueManager.next();
            } else if (e.key === "ArrowLeft") {
                musicManager.musicManager.queueManager.previous();
    }
}};
}