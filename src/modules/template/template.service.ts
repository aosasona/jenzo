import { readFile } from "fs/promises";
import path from "path";
import { NotFoundException } from "../../lib/exceptions";
import PromiseFS from "../../lib/promise/fs";
import { MakeTemplateArgs, RawTemplateResult } from "../../types/template";
import {
  GetTemplateRequestParams,
  GetTemplateRequestQuery,
} from "./template.schema";

export default class TemplateService {
  private static readonly TEMPLATES_DIR = path.join(
    __dirname,
    "../../..",
    "templates"
  );
  public static async getRawTemplate(
    args: GetTemplateRequestParams & GetTemplateRequestQuery
  ): Promise<RawTemplateResult> {
    const { name, variant, style } = args;
    const templateDir = TemplateService.TEMPLATES_DIR + `/${name}`;
    if (!(await PromiseFS.exists(templateDir))) {
      throw new NotFoundException(`Template '${name}' not found!`);
    }

    const htmlPath = templateDir + `/${variant || "default"}.html`;
    if (!(await PromiseFS.exists(htmlPath))) {
      throw new NotFoundException(`Variant '${variant}' not found!`);
    }

    const stylePath = templateDir + `/${style || "default"}.css`;
    if (!(await PromiseFS.exists(stylePath))) {
      throw new NotFoundException(`Style '${style}' not found!`);
    }

    const [html, css] = await Promise.all([
      readFile(htmlPath, "utf8"),
      readFile(stylePath, "utf8"),
    ]);

    const rawTemplate = {
      html,
      css,
      path: templateDir,
    };

    return rawTemplate;
  }

  public static makeBaseTemplate(data: MakeTemplateArgs): string {
    let fullHtml = "<html><head>";

    if (data.css) {
      fullHtml += `<style>${data.css}</style>`;
    }

    fullHtml += `</head>${data.html}</html>`;

    return fullHtml;
  }
}
