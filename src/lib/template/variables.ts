import { TemplateVars } from "../../types/template";

export function parseVars(data: string): { [x: string]: string } {
  let parsedVars: { [x: string]: string } = {};
  if (!data) return parsedVars;

  const kvArray = data?.trim()?.split(",");
  if (kvArray.length == 0) return parsedVars;

  (kvArray as string[]).forEach(function(kv) {
    const splitKV = kv?.trim()?.split(":");
    if (splitKV?.length !== 2) return;
    parsedVars[splitKV[0]] = splitKV[1];
  });

  return parsedVars;
}

export function injectVars(
  html: string,
  vars: TemplateVars,
  defaultVars: TemplateVars
): string {
  const combinedVars = Object.assign(defaultVars, vars);
  const keys = Object.keys(combinedVars);
  if (keys.length == 0) return html;

  (keys as typeof keys).forEach(function(key) {
    const target = `{{vars.${key?.toLowerCase()}}}`;
    html = html?.replaceAll(target, combinedVars[key]);
  });

  return html;
}
