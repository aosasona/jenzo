import { z } from "zod";
import { ZodBaseResponse } from "./request";

export const getTemplateParams = z.object({
  name: z.string({
    required_error: "Template name is required",
    invalid_type_error: "Template name must be a string",
  }),
});

export const getTemplateQuery = z.object({
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

export const getTemplateResponse = z.object({
  ...ZodBaseResponse,
  data: z
    .object({
      name: z.string(),
      raw: z.object({
        html: z.string(),
        css: z.string(),
        path: z.string(),
      }),
      combined: z.string(),
    })
    .optional(),
});

export const previewTemplateQuery = getTemplateQuery.extend({
  vars: z.string().optional(),
});

export const previewTemplateResponse = z.object({
  ...ZodBaseResponse,
  data: z
    .object({
      name: z.string(),
      variant: z.string(),
      style: z.string(),
      html: z.string(),
    })
    .optional(),
});

export const templateSchema = z.object({
  name: z.string(),
  variants: z.array(z.string()),
  styles: z.array(z.string()),
});

export const getTemplatesResponse = z.object({
  ...ZodBaseResponse,
  data: z.array(templateSchema),
});
