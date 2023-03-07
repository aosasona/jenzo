import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { ZodBaseResponse } from "../../schemas/request";

const getTemplateRequestParams = z.object({
  name: z.string({
    required_error: "Template name is required",
    invalid_type_error: "Template name must be a string",
  }),
});

const getTemplateRequestQuery = z.object({
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

export type GetTemplateRequestParams = z.infer<typeof getTemplateRequestParams>;
export type GetTemplateRequestQuery = z.infer<typeof getTemplateRequestQuery>;
export type GetTemplateResponse = z.infer<typeof getTemplateResponse>;

const { schemas, $ref } = buildJsonSchemas({
  getTemplateRequestParams,
  getTemplateRequestQuery,
  getTemplateResponse,
});

export const getTemplateSchema = {
  schema: {
    params: $ref("getTemplateRequestParams"),
    query: $ref("getTemplateRequestQuery"),
    response: {
      200: $ref("getTemplateResponse"),
    },
  },
};

export { schemas as templateSchemas, $ref };
