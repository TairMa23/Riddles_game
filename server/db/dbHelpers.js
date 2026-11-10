import fs from 'fs/promises';

const dbPath = new URL('./db.json', import.meta.url);

export async function readDb() {
	const contents = await fs.readFile(dbPath, 'utf8');
	return JSON.parse(contents);
}

export async function writeDb(db) {
	await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8');
}
