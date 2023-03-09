import { mkdir, readFile, rm, stat, writeFile } from "fs/promises";
import path from "path";
import { GenerateImageQuery } from "../../modules/image/image.schema";
import { existsAsync } from "../promise/fs";
import { parseVars } from "../template";

interface GenerateCachedImageArgs {
  size: GenerateImageQuery["size"];
  vars: string;
  templateName: string;
}

interface AddToCacheArgs {
  name: string;
  format: GenerateImageQuery["format"];
  buffer: Buffer | string;
}

const CACHE_DIR = path.join(__dirname, "../../..", "cache");

export async function addToCache(args: AddToCacheArgs) {
  if (await findInCache(args.name, args.format)) return;

  const filePath = `${CACHE_DIR}/${args.name}.${args.format || "png"}`;
  return await writeFile(filePath, args.buffer);
}

export async function findInCache(
  name: string,
  ext: GenerateImageQuery["format"]
): Promise<Buffer | null> {
  if (!(await existsAsync(CACHE_DIR))) {
    await mkdir(CACHE_DIR);
    return null;
  }

  const filePath = `${CACHE_DIR}/${name}.${ext || "png"}`;
  if (!(await existsAsync(filePath))) return null;

  if (!(await validateCacheItem(filePath))) {
    await deleteOnExpiry(filePath);
    return null;
  }

  return await readFile(filePath);
}

export async function validateCacheItem(path: string): Promise<boolean> {
  const ttl = parseInt(process.env?.CACHE_TTL || "1");
  const cacheStats = await stat(path);
  const cacheAgeInMinutes =
    (Date.now() - (cacheStats?.mtimeMs || 0)) / (1000 * 60);

  return ttl > cacheAgeInMinutes;
}

export async function deleteOnExpiry(path: string) {
  return await rm(path);
}

export function generateCachedImageName(args: GenerateCachedImageArgs): string {
  const parsedVars = parseVars(args.vars);
  const valuesString =
    Object?.values(parsedVars)?.join("_")?.toLowerCase() || "";
  const templateName = args?.templateName?.substring(0, 1)?.toLowerCase() || "";
  const size = args?.size == "large" ? "l" : "s";

  let name = `${templateName}${size}_${valuesString}`;

  if (name?.length > 64) {
    name = name.substring(0, 64);
  }

  return name;
}
