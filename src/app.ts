import Fastify from "fastify";
import fastifyEnv from "@fastify/env";
import fastifyCors from "@fastify/cors";
import handleException from "./lib/exceptions/handler";
import { default as jenzoConfig } from "./jenzo.config";
import { default as envSchema } from "./schemas/env";
import TemplateRoutes from "./modules/template/template.route";
import { templateSchemas } from "./modules/template/template.schema";
import { Route } from "./types/modules";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      ADDR: string;
      PORT: number;
      ALLOWED_IPS: string;
    };
  }
}

export default class App {
  private static readonly server = Fastify({ logger: true });

  private async bootstrap() {
    await App.loadEnv();
    await App.server.after(); // fastify does not load the environment variables unless this is called

    await App.configureCors();
    App.addSchemas();
    App.addHealthCheck();
    App.initAPIRoutes([new TemplateRoutes()]);
    App.attachErrorHandler();
  }

  public async listen() {
    await this.bootstrap();

    const { PORT, ADDR } = App.server.config;

    return App.server.listen({ port: PORT, host: ADDR });
  }

  public getServer() {
    return App.server;
  }

  private static async configureCors() {
    const corsConf = jenzoConfig.allowedOrigins;
    await App.server.register(fastifyCors, {
      origin: corsConf,
    });
  }

  private static async loadEnv() {
    const opts = {
      confKey: "config",
      schema: envSchema,
      dotenv: true,
      data: process.env,
    };

    await App.server.register(fastifyEnv, opts);
  }

  private static attachErrorHandler() {
    App.server.setErrorHandler(function(err, _, reply) {
      console.error(err.message);
      if (!err.validation && !err.validationContext) {
        const { message, code } = handleException(err);
        return reply.status(code).send({ ok: false, message });
      }
      return reply.status(400).send({ ok: false, message: err.message });
    });
  }

  private static addHealthCheck() {
    App.server.get("/health", async function(_, reply) {
      return reply.send({ ok: true });
    });
  }

  private static addSchemas() {
    for (const schema of [...templateSchemas]) {
      App.server.addSchema(schema);
    }
  }

  private static initAPIRoutes(routes: Route[]) {
    if (routes.length == 0) return;

    routes.forEach((route) => {
      App.server.register(route.init, {
        prefix: `api/v1/${route.prefix}`,
      });
    });
  }
}
