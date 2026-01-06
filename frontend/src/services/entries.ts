import { http } from "./http.ts"

export type Entry = {
		id: number;
		filepath: string;
		latitude: number;
		longitude: number;
};

export type GuessRequest = {
		img_id: number;
		latitude: number;
		longitude: number;
};

export type GuessResponse = {
		img_id: number;
		guess_latitude: number;
		guess_longitude: number;
		true_latitude: number;
		true_longitude: number;
		distance: number;
		score: number;
};

export async function getRandomEntry(): Promise<Entry> {
		const res = await http.get("/image");
		return res.data as Entry;
}

export async function postGuess(payload: GuessRequest): Promise<GuessResponse> {
		const res = await http.post("/guess", payload);
		return res.data as GuessResponse;
}
