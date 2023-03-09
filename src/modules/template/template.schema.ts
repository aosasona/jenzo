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
} from "../../schemas/template";

export type GetTemplateParams = z.infer<typeof getTemplateParams>;
export type GetTemplateQuery = z.infer<typeof getTemplateQuery>;
export type PreviewTemplateQuery = z.infer<typeof previewTemplateQuery>;
export type GetTemplateResponse = z.infer<typeof getTemplateResponse>;
export type CreateTemplateBody = z.infer<typeof createTemplateBody>;

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
      200: $ref("createTemplateResponse"),
    },
  },
};

export { schemas as templateSchemas, $ref };
