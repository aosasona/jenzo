import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const getTemplateRequest = z.object({
  name: z.string({
    required_error: "Template name is required",
    invalid_type_error: "Template name must be a string",
  }),
  variant: z.string({
    invalid_type_error: "Template variant must be a string",
  }),
  style: z.string({
    invalid_type_error: "Template style must be a string",
  }),
});

export type GetTemplateRequest = z.infer<typeof getTemplateRequest>;

const { schemas, $ref } = buildJsonSchemas({
  getTemplateRequest,
});

export { schemas as templateSchemas, $ref };
