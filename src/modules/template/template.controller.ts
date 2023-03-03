import { FastifyReply, FastifyRequest } from "fastify";
import { GetTemplateArgs } from "../../types/template";
import { GetTemplateRequest } from "./template.schema";
import TemplateService from "./template.service";

export default class TemplateController {
  public static async getTemplate(
    request: FastifyRequest<{ Querystring: GetTemplateRequest }>,
    reply: FastifyReply
  ) {
    const query = request.query as GetTemplateArgs;

    const template = await TemplateService.getRawTemplate(query);
    const combined = TemplateService.makeBaseTemplate({
      html: template.html,
      css: template.css,
    });

    return reply.code(200).send({
      ok: true,
      message: `Got data for template ${query.name}`,
      data: { name: query.name, combined, raw: { ...template } },
    });
  }
}
