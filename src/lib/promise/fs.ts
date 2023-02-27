import { promisify } from "util";
import fs from "fs";

export default class PromiseFS {
  public static exists = promisify(fs.exists);
  public static readFile = promisify(fs.readFile);
}
