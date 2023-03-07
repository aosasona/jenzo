import { FastifyInstance } from "fastify";
import { Route } from "../../types/modules";
import TemplateController from "./template.controller";
import { getTemplateSchema } from "./template.schema";

export default class TemplateRoutes implements Route {
  public prefix = "templates";

  public init(server: FastifyInstance, _: any, done: any) {
    server.get("/", getTemplateSchema, TemplateController.getTemplate);
    server.get("/:name", getTemplateSchema, TemplateController.getTemplate);
    done();
  }
}
