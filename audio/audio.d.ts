export interface SongProps {
	songTitle: string;
	artist: string;
	url: string;
	picture?: string;
	duration?: number;

	isCustom?: boolean;
}
