import { readFile, readdir, mkdir, writeFile } from "fs/promises";
import { NotFoundException } from "../../lib/exceptions";
import { existsAsync } from "../../lib/promise/fs";
import { injectVars, parseVars, TEMPLATES_DIR } from "../../lib/template";
import type {
  CreateTemplateBody,
  ModifyTemplateBody,
  ModifyTemplateParams,
  TemplateVariant,
} from "./template.schema";
import {
  BaseGetTemplateMethodArgs,
  MakeTemplateArgs,
  PreviewTemplateArgs,
  RawTemplateResult,
  Template,
} from "../../types/template";
import ClientException from "../../lib/exceptions/ClientException";
import path from "path";

export default class TemplateService {
  private static readonly TEMPLATES_DIR = TEMPLATES_DIR;

  public static async createTemplate(args: CreateTemplateBody) {
    const { name, _default } = args;

    const templatePath = TemplateService.TEMPLATES_DIR + `/${name}`;
    if (await existsAsync(templatePath)) {
      throw new ClientException("Template already exists!");
    }

    await mkdir(templatePath);

    await Promise.all([
      writeFile(`${templatePath}/default.html`, _default?.html || "", "utf-8"),
      writeFile(`${templatePath}/default.css`, _default?.css || "", "utf-8"),
    ]);
  }

  public static async modifyTemplate(args: ModifyTemplateParams & ModifyTemplateBody) {
    const { name, data } = args;
    const modifiedVariants: string[] = [];

    const templatePath = TemplateService.TEMPLATES_DIR + `/${name}`;
    for (const variant of data) {
      await TemplateService.modifyVariant(templatePath, variant);
      modifiedVariants.push(variant.variant);
    }

    return modifiedVariants;
  }

  private static async modifyVariant(path: string, data: TemplateVariant) {
    const { html, css, variant } = data;

    if (!!html) {
      const htmlPath = path + `/${variant}.html`;
      await writeFile(htmlPath, html, "utf-8");
    }

    if (!!css) {
      const cssPath = path + `/${variant}.css`;
      await writeFile(cssPath, css, "utf-8");
    }
  }

  public static async getTemplates(): Promise<Template[]> {
    const templates: Template[] = [];

    const dirs = (await readdir(TemplateService.TEMPLATES_DIR))?.filter((dir) => !dir?.startsWith("."));

    if (dirs.length == 0) return templates;

    for (let i = 0; i < dirs.length; i++) {
      const styles: string[] = [];
      const variants: string[] = [];
      const currentTemplateDir = (await readdir(TemplateService.TEMPLATES_DIR + `/${dirs[i]}`))?.filter((content) => !content.startsWith("."));

      if (currentTemplateDir?.length == 0) continue;

      currentTemplateDir.forEach(function(dir) {
        if (dir?.endsWith(".html")) {
          variants.push(dir?.split(".")?.[0]);
        } else if (dir?.endsWith(".css")) {
          styles.push(dir?.split(".")?.[0]);
        }
      });

      templates.push({ name: dirs[i], styles, variants });
    }

    return templates;
  }

  public static async getRawTemplate(args: BaseGetTemplateMethodArgs): Promise<RawTemplateResult> {
    const { name, variant, style } = args;

    const templateDir = path.join(TemplateService.TEMPLATES_DIR, `${name}`);
    if (!(await existsAsync(templateDir))) {
      throw new NotFoundException(`Template '${name}' not found!`);
    }

    const htmlPath = path.join(templateDir, `${variant || "default"}.html`);
    if (!(await existsAsync(htmlPath))) {
      throw new NotFoundException(`Variant '${variant}' not found!`);
    }

    const stylePath = path.join(templateDir, `${style || variant || "default"}.css`);
    if (!(await existsAsync(stylePath))) {
      throw new NotFoundException(`Style '${style}' not found!`);
    }

    const [html, css] = await Promise.all([readFile(htmlPath, "utf-8"), readFile(stylePath, "utf-8")]);

    const rawTemplate = { html, css, path: templateDir };

    return rawTemplate;
  }

  public static makeBaseTemplate(data: MakeTemplateArgs): string {
    let fullHtml = "<html>\n<head>";

    if (data.css) {
      fullHtml += `<style>${data.css}</style>`;
    }

    fullHtml += `</head>${data.html}</html>`;

    return fullHtml;
  }

  private static async getDefaultVars(name: string): Promise<{ [x: string]: string }> {
    const varsPath = TemplateService.TEMPLATES_DIR + `/${name}/vars.json`;

    if (!(await existsAsync(varsPath))) { return {}; }

    const defaultVars = await readFile(varsPath, "utf-8");
    return JSON.parse(defaultVars) || {};
  }

  public static async getParsedTemplate(args: PreviewTemplateArgs): Promise<string> {
    const vars = parseVars(args?.vars || "");
    const templateParts = await TemplateService.getRawTemplate(args);
    const fullHtml = TemplateService.makeBaseTemplate(templateParts);
    const defaultVars = await TemplateService.getDefaultVars(args.name);
    const parsedTemplate = injectVars(fullHtml, vars, defaultVars);
    return parsedTemplate;
  }
}
