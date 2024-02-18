import { FastifyReply, FastifyRequest } from "fastify";
import TemplateService from "../template/template.service";
import { GenerateImageParams, GenerateImageQuery } from "./image.schema";
import ImageService from "./image.service";

export default class ImageController {
  public static async generateImage(request: FastifyRequest<{ Querystring: GenerateImageQuery; Params: GenerateImageParams }>, reply: FastifyReply) {
    const { query, params } = request;

    const html = await TemplateService.getParsedTemplate({ ...params, ...query });

    const data = await ImageService.generateImage({
      html,
      templateName: params.name,
      size: query.size,
      vars: query.vars,
      asBuffer: query.asBuffer ?? false,
    });

    return reply.code(200).send({
      ok: true,
      message: `generated image successfully`,
      data: {
        size: query.size,
        image: data,
      },
    });
  }

  public static async previewImage(request: FastifyRequest<{ Querystring: GenerateImageQuery; Params: GenerateImageParams }>, reply: FastifyReply) {
    const { query, params } = request;

    const html = await TemplateService.getParsedTemplate({ ...params, ...query });

    const data = await ImageService.generateImage({
      html,
      templateName: params.name,
      vars: query.vars,
      size: query.size,
    });

    return reply.type("image/png").send(data);
  }
}
