import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { ZodBaseResponse } from "../../schemas/request";

const getTemplateRequest = z.object({
  name: z.string({
    required_error: "Template name is required",
    invalid_type_error: "Template name must be a string",
  }),
  variant: z
    .string({
      invalid_type_error: "Template variant must be a string",
    })
    .optional(),
  style: z
    .string({
      invalid_type_error: "Template style must be a string",
    })
    .optional(),
});

const getTemplateResponse = z.object({
  ...ZodBaseResponse,
  data: z.object({
    name: z.string(),
    raw: z.object({
      html: z.string(),
      css: z.string(),
      path: z.string(),
    }),
    combined: z.string(),
  }),
});

export type GetTemplateRequest = z.infer<typeof getTemplateRequest>;
export type GetTemplateResponse = z.infer<typeof getTemplateResponse>;

const { schemas, $ref } = buildJsonSchemas({
  getTemplateRequest,
  getTemplateResponse,
});

export const getTemplateSchema = {
  schema: {
    query: $ref("getTemplateRequest"),
    response: {
      200: $ref("getTemplateResponse"),
    },
  },
};

export { schemas as templateSchemas, $ref };
