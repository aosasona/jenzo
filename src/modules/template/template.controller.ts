import { FastifyReply, FastifyRequest } from "fastify";
import {
  GetTemplateParams,
  GetTemplateQuery,
  PreviewTemplateQuery,
} from "./template.schema";
import TemplateService from "./template.service";

export default class TemplateController {
  public static async getAllTemplates(_: FastifyRequest, reply: FastifyReply) {
    const templates = await TemplateService.getTemplates();

    return reply.code(200).send({
      ok: true,
      message: "result for all templates",
      data: templates,
    });
  }

  public static async getTemplate(
    request: FastifyRequest<{
      Params: GetTemplateParams;
      Querystring: GetTemplateQuery;
    }>,
    reply: FastifyReply
  ) {
    const { params, query } = request;

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

  public static async previewTemplate(
    request: FastifyRequest<{
      Params: GetTemplateParams;
      Querystring: PreviewTemplateQuery;
    }>,
    reply: FastifyReply
  ) {
    const { params, query } = request;

    const parsedTemplate = await TemplateService.getParsedTemplate({
      ...params,
      ...query,
    });

    return reply.code(200).send({
      ok: true,
      message: `preview for template '${params.name}'`,
      data: {
        name: params.name,
        html: parsedTemplate,
        variant: query?.variant || "default",
        style: query?.style || "default",
      },
    });
  }
}
