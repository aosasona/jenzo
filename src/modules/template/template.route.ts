import { FastifyInstance } from "fastify";
import { Route } from "../../types/modules";
import TemplateController from "./template.controller";
import {
  createTemplateSchema,
  getTemplateSchema,
  getTemplatesSchema,
  modifyTemplateSchema,
  previewTemplateSchema,
} from "./template.schema";

export default class TemplateRoutes implements Route {
  public prefix = "templates";

  public init(server: FastifyInstance, _: any, done: any) {
    server.post("/", createTemplateSchema, TemplateController.createTemplate);
    server.post(
      "/:name",
      { ...modifyTemplateSchema, preHandler: [(server as any).protect] },
      TemplateController.modifyTemplate
    );
    server.get("/", getTemplatesSchema, TemplateController.getAllTemplates);
    server.get("/:name", getTemplateSchema, TemplateController.getTemplate);
    server.get(
      "/:name/preview",
      previewTemplateSchema,
      TemplateController.previewTemplate
    );
    done();
  }
}
