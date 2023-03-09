import { FastifyReply, FastifyRequest } from "fastify";
import { GenerateImageParams, GenerateImageQuery } from "./image.schema";

export default class ImageController {
  public static async generateImage(
    request: FastifyRequest<{
      Querystring: GenerateImageQuery;
      Params: GenerateImageParams;
    }>,
    reply: FastifyReply
  ) {
    const { query, params } = request;

    return reply.code(200).send({
      ok: true,
      message: `generated image successfully`,
    });
  }
}
