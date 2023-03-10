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

export const createTemplateBody = z.object(
  {
    name: z.string({
      required_error: "name is a required field",
      invalid_type_error: "name must be a string",
    }),
    _default: z
      .object(
        {
          html: z
            .string({ invalid_type_error: "html must be a string" })
            .optional(),
          css: z
            .string({ invalid_type_error: "css must be a string" })
            .optional(),
        },
        { invalid_type_error: "invalid default type provided" }
      )
      .optional(),
  },
  { required_error: "body not provided!" }
);

export const createTemplateResponse = z.object({
  ...ZodBaseResponse,
  data: z.object({
    name: z.string(),
  }),
});

export const modifyTemplateParams = z.object({
  name: z.string({
    required_error: "template name is required",
    invalid_type_error: "template name is of an invalid type",
  }),
});

export const templateVariant = z.object({
  variant: z.string({
    required_error: "each object requires a variant name",
    invalid_type_error: "variant (name) must be of type string",
  }),
  html: z.string().optional(),
  css: z.string().optional(),
});

export const modifyTemplateBody = z.object({
  data: z.array(templateVariant, {
    required_error: "no body provided",
    invalid_type_error:
      "data must be an array of objects containing a variant (mandatory) and the html or css for that variant",
    description:
      "an array of objects including the variant name, the html and css for the template's variant (optional)",
  }),
});

export const modifyTemplateResponse = z.object({
  ...ZodBaseResponse,
  data: z.object({
    modified: z.array(z.string(), {
      description: "an array of variants updated or created",
    }),
  }),
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
