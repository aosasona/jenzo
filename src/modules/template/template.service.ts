import { readFile, readdir } from "fs/promises";
import { NotFoundException } from "../../lib/exceptions";
import PromiseFS from "../../lib/promise/fs";
import { TEMPLATES_DIR } from "../../lib/template";
import { parseVars } from "../../lib/template/variables";
import {
  BaseGetTemplateMethodArgs,
  MakeTemplateArgs,
  PreviewTemplateArgs,
  RawTemplateResult,
  Template,
} from "../../types/template";

export default class TemplateService {
  private static readonly TEMPLATES_DIR = TEMPLATES_DIR;

  public static async getTemplates(): Promise<Template[]> {
    const templates: Template[] = [];

    const dirs = (await readdir(TemplateService.TEMPLATES_DIR))?.filter(
      (dir) => !dir?.startsWith(".")
    );

    if (dirs.length == 0) return templates;

    for (let i = 0; i < dirs.length; i++) {
      const styles: string[] = [];
      const variants: string[] = [];
      const currentTemplateDir = (
        await readdir(TemplateService.TEMPLATES_DIR + `/${dirs[i]}`)
      )?.filter((content) => !content.startsWith("."));

      if (currentTemplateDir?.length == 0) continue;

      currentTemplateDir.forEach(function(dir) {
        if (dir?.endsWith(".html")) {
          variants.push(dir?.split(".")[0]);
        } else if (dir?.endsWith(".css")) {
          styles.push(dir?.split(".")[0]);
        }
      });

      templates.push({
        name: dirs[i],
        styles,
        variants,
      });
    }

    return templates;
  }

  public static async getRawTemplate(
    args: BaseGetTemplateMethodArgs
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

  public static async getTemplatePreview(args: PreviewTemplateArgs) {
    const vars = parseVars(args.vars || "");
    console.log(vars);
  }
}
