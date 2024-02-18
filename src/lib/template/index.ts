import path from "path";
import { parseVars, injectVars } from "./variables";

export const TEMPLATES_DIR = path.join(__dirname, "../../..", "data", "templates");
export { parseVars, injectVars };
