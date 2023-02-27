import { FastifyReply, FastifyRequest } from "fastify";
import { GetTemplateRequest } from "./template.schema";
import TemplateService from "./template.service";

export default class TemplateController {
  public static async getTemplate(
    request: FastifyRequest<{ Body: GetTemplateRequest }>,
    reply: FastifyReply
  ) {
    const body = request.body;

    const template = await TemplateService.getRawTemplate(body);

    return reply
      .code(200)
      .send({
        ok: true,
        message: `Got data for template ${body.name}`,
        data: template,
      });
  }
}
