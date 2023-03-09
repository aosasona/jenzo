import { FastifyInstance } from "fastify";
import { Route } from "../../types/modules";
import ImageController from "./image.controller";
import { generateImageSchema } from "./image.schema";

export default class ImageRoutes implements Route {
  public prefix = "templates";

  public init(server: FastifyInstance, _: any, done: any) {
    server.get("/", generateImageSchema, ImageController.generateImage);
    done();
  }
}
