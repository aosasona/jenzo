import { z } from "zod";
import { ZodBaseResponse } from "./request";
import { getTemplateParams, previewTemplateQuery } from "./template";

export const generateImageParams = getTemplateParams;

export const generateImageQuery = previewTemplateQuery.extend({
  size: z.enum(["xs", "sm", "lg"]).default("xs").optional(),
  format: z.enum(["svg", "png"]).default("png").optional(),
});

export const generateImageResponse = z.object({
  ...ZodBaseResponse,
  data: z.object({
    size: generateImageQuery.shape.size,
    format: generateImageQuery.shape.format,
    image: z.string(),
  }),
});
