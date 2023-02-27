export interface Template {
  style: string;
  html: string;
  assets: string;
}

export interface TemplateVars {
  [x: string]: string;
}

export interface MakeTemplateArgs {
  html: string;
  css?: string;
  vars?: TemplateVars[];
}

export interface GetTemplateArgs {
  name: string;
  variant?: string;
  style?: string;
}

export interface RawTemplateResult
  extends Pick<Required<MakeTemplateArgs>, "html" | "css"> {
  path: string;
}
