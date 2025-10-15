import { http } from "./http.ts"

export type Entry = {
		id: number;
		filepath: string;
		latitude: number;
		longitude: number;
};

export async function getRandomEntry(): Promise<Entry> {
		const res = await http.get("/image");
		return res.data as Entry;
}
