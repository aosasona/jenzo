import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateTemplateBody,
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

  public static async createTemplate(
    request: FastifyRequest<{ Body: CreateTemplateBody }>,
    reply: FastifyReply
  ) {
    const { body } = request;

    await TemplateService.createTemplate(body);

    return reply.code(200).send({
      ok: true,
      message: `created new template ${body.name}`,
      data: {
        name: body?.name,
      },
    });
  }
}
