import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { Schema } from "../../types/modules";
import {
  createTemplateBody,
  getTemplateParams,
  getTemplateQuery,
  getTemplateResponse,
  getTemplatesResponse,
  previewTemplateQuery,
  previewTemplateResponse,
  createTemplateResponse,
  modifyTemplateBody,
  modifyTemplateParams,
  modifyTemplateResponse,
  templateVariant,
} from "../../schemas/template";

export type GetTemplateParams = z.infer<typeof getTemplateParams>;
export type GetTemplateQuery = z.infer<typeof getTemplateQuery>;
export type PreviewTemplateQuery = z.infer<typeof previewTemplateQuery>;
export type GetTemplateResponse = z.infer<typeof getTemplateResponse>;
export type CreateTemplateBody = z.infer<typeof createTemplateBody>;
export type ModifyTemplateParams = z.infer<typeof modifyTemplateParams>;
export type ModifyTemplateBody = z.infer<typeof modifyTemplateBody>;
export type TemplateVariant = z.infer<typeof templateVariant>;

const { schemas, $ref } = buildJsonSchemas(
  {
    getTemplateParams,
    getTemplateQuery,
    getTemplateResponse,
    getTemplatesResponse,
    previewTemplateQuery,
    previewTemplateResponse,
    createTemplateBody,
    createTemplateResponse,
    modifyTemplateBody,
    modifyTemplateParams,
    modifyTemplateResponse,
  },
  { $id: "TemplateSchema" }
);

export const getTemplateSchema: Schema = {
  schema: {
    params: $ref("getTemplateParams"),
    querystring: $ref("getTemplateQuery"),
    response: {
      200: $ref("getTemplateResponse"),
    },
  },
};

export const getTemplatesSchema: Schema = {
  schema: {
    response: {
      200: $ref("getTemplatesResponse"),
    },
  },
};

export const previewTemplateSchema: Schema = {
  schema: {
    params: $ref("getTemplateParams"),
    querystring: $ref("previewTemplateQuery"),
    response: {
      200: $ref("previewTemplateResponse"),
    },
  },
};

export const createTemplateSchema: Schema = {
  schema: {
    body: $ref("createTemplateBody"),
    response: {
      201: $ref("createTemplateResponse"),
    },
  },
};

export const modifyTemplateSchema: Schema = {
  schema: {
    body: $ref("modifyTemplateBody"),
    params: $ref("modifyTemplateParams"),
    response: {
      200: $ref("modifyTemplateResponse"),
    },
  },
};

export { schemas as templateSchemas, $ref };
