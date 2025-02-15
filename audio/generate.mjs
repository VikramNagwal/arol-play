import { parseFile } from "music-metadata";
import * as fs from "fs/promises";
import * as path from "path";

const songFormats = [".mp3", ".wav", ".mp4", ".webm", ".ogg"];

async function main() {
	const publicDir = await fs.readdir("public");
	const songs = [];

	const tasks = publicDir
		.filter((items) => songFormats.includes(path.extname(items)))
		.map(async (items) => {
			const metadata = await parseFile(path.resolve("public", items));

			const base = {
				songTitle: metadata.common.title ? metadata.common.title : "unknown",
				artist: metadata.common.artist,
				album: metadata.common.album ? metadata.common.album : "single track",
				songDuration: Math.floor(metadata.format.duration),
				url: `/${items}`,
			};

			if (metadata.common.picture) {
				const { format, data } = metadata.common.picture[0];
				const ext = format.split("/")[1];
				const baseTitle = items.split(".")[0];
				const name = `${baseTitle}-thumbnail.${ext}`;

				await fs.writeFile(path.resolve("public", name), data);
				base.thumbnail = `/${name}`;
			}

			songs.push(base);
		});

	await Promise.all(tasks);
	await fs.writeFile("audio/audio.json", JSON.stringify(songs, null, 2));
}

void main();
