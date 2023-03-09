import { readFile } from "fs/promises";
import * as puppeteer from "puppeteer";
import {
  addToCache,
  findInCache,
  generateCachedImageName,
} from "../../lib/image/cache";
import { imageSizes } from "../../lib/image/options";
import { TEMPLATES_DIR } from "../../lib/template";
import { GenerateImageQuery } from "./image.schema";

export default class ImageService {
  public static async generateImage(args: {
    templateName: string;
    html: string;
    size: GenerateImageQuery["size"];
    asBuffer?: boolean;
    vars: GenerateImageQuery["vars"];
  }): Promise<string | Buffer | null> {
    const { html, templateName, asBuffer, vars } = args;
    let { size } = args;

    const cacheName = generateCachedImageName({
      size: size,
      templateName,
      vars: vars || "",
    });
    const cachedData = await findInCache(cacheName, "png");
    if (cachedData) return cachedData;

    const opts =
      process.env.NODE_ENV === "production"
        ? {
          executablePath: "/usr/bin/google-chrome-stable",
          args: ["--no-sandbox"],
        }
        : {};

    const browser = await puppeteer.launch(opts);
    const page = await browser.newPage();
    size = size || "large";
    if (!["large", "small"].includes(size)) {
      size = "large";
    }

    const dimensions = imageSizes[size];

    await page.setRequestInterception(true);
    page.on("request", (req) =>
      ImageService.handleLocalImage(req, templateName)
    );

    await page.setViewport({
      ...dimensions,
    });
    await page.setContent(html);

    const output = await page.screenshot({
      encoding: asBuffer ? "base64" : "binary",
      fullPage: false,
    });

    await browser.close();

    // only supports png at the moment, so, it is safe to hard-code it
    if (!asBuffer) {
      await addToCache({
        name: cacheName,
        buffer: output,
        format: "png",
      });
    }

    return output;
  }

  private static async handleLocalImage(
    request: puppeteer.HTTPRequest,
    templateName: string
  ) {
    if (request.resourceType() === "image") {
      const { isLocal, path } = ImageService.getImagePathFromUrl(
        request?.url(),
        templateName
      );

      if (!isLocal) {
        return request.continue();
      }

      try {
        const contentType = request.headers()?.["content-type"];
        const imageBuffer = await readFile(path, "base64");

        return request.respond({
          status: 200,
          contentType,
          body: imageBuffer,
        });
      } catch (err) {
        return request.abort();
      }
    }
  }

  private static getImagePathFromUrl(
    url: string,
    templateName: string
  ): {
    isLocal: boolean;
    path: string;
  } {
    if (!url?.startsWith("file://")) {
      return { isLocal: false, path: url };
    }

    const requestedImage = url?.split("/")?.pop();
    const imagePath =
      TEMPLATES_DIR + `/${templateName}/assets/${requestedImage}`;

    return { isLocal: true, path: imagePath };
  }
}
