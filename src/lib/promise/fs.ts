import { promisify } from "util";
import fs from "fs";

export const existsAsync = promisify(fs.exists);
