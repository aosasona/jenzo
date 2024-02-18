import { z } from "zod";
import { ZodBaseResponse } from "./request";
import { getTemplateParams, previewTemplateQuery } from "./template";

export const generateImageParams = getTemplateParams;

export const generateImageQuery = previewTemplateQuery.extend({
  size: z
    .enum(["small", "medium", "large"], {
      invalid_type_error: "size must be `small`, `medium` or `large`",
    })
    .optional(),
  format: z.enum(["svg", "png"], { invalid_type_error: "format must be svg or png" }).optional(),
  asBuffer: z.boolean().optional(),
});

export const generateImageResponse = z.object({
  ...ZodBaseResponse,
  data: z.object({
    size: generateImageQuery.shape.size,
    image: z.string(),
  }),
});
