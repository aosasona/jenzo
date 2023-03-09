import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { Schema } from "../../types/modules";
import {
	generateImageParams,
	generateImageQuery,
	generateImageResponse,
} from "../../schemas/image";

export type GenerateImageQuery = z.infer<typeof generateImageQuery>;
export type GenerateImageParams = z.infer<typeof generateImageParams>;

const { schemas, $ref } = buildJsonSchemas(
	{
		generateImageParams,
		generateImageQuery,
		generateImageResponse,
	},
	{ $id: "ImageSchema" }
);

export const generateImageSchema: Schema = {
	schema: {
		params: $ref("generateImageParams"),
		querystring: $ref("generateImageQuery"),
		response: {
			200: $ref("generateImageResponse"),
		},
	},
};

export { schemas as imageSchemas, $ref };
