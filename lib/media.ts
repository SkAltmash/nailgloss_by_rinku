import "server-only";
import fs from "node:fs";
import path from "node:path";

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

/** Lists image files in /public/<folder>, sorted by name. Empty if missing. */
export function listPublicImages(folder: string): string[] {
  const dir = path.join(process.cwd(), "public", folder);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => IMAGE_EXT.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/${folder}/${encodeURIComponent(f)}`);
  } catch {
    return [];
  }
}

export function publicFileExists(file: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", file));
}
