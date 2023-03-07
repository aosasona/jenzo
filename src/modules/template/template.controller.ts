import { FastifyReply, FastifyRequest } from "fastify";
import {
  GetTemplateRequestParams,
  GetTemplateRequestQuery,
} from "./template.schema";
import TemplateService from "./template.service";

export default class TemplateController {
  public static async getTemplate(
    request: FastifyRequest<{
      Params: GetTemplateRequestParams;
      Querystring: GetTemplateRequestQuery;
    }>,
    reply: FastifyReply
  ) {
    const params = request.params;
    const query = request.query;

    const template = await TemplateService.getRawTemplate({
      ...params,
      ...query,
    });
    const combined = TemplateService.makeBaseTemplate({
      html: template.html,
      css: template.css,
    });

    return reply.code(200).send({
      ok: true,
      message: `result for template '${params.name}'`,
      data: { name: params.name, combined, raw: { ...template } },
    });
  }
}
