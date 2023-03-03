import { z } from "zod";

export const ZodBaseResponse = {
  ok: z.boolean(),
  message: z.string(),
};
