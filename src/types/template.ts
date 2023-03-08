import {
  GetTemplateParams,
  GetTemplateQuery,
  PreviewTemplateQuery,
} from "../modules/template/template.schema";

export interface Template {
  name: string;
  variants: string[];
  styles: string[];
}

export interface TemplateVars {
  [x: string]: string;
}

export type BaseGetTemplateMethodArgs = GetTemplateParams & GetTemplateQuery;

export type PreviewTemplateArgs = GetTemplateParams & PreviewTemplateQuery;

export interface MakeTemplateArgs {
  html: string;
  css?: string;
}

export interface RawTemplateResult
  extends Pick<Required<MakeTemplateArgs>, "html" | "css"> {
  path: string;
}
