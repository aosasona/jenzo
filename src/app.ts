import Fastify from "fastify";
import fastifyEnv from "@fastify/env";
import fastifyCors from "@fastify/cors";
import handleException from "./lib/exceptions/handler";
import { default as envSchema } from "./schemas/env";
import TemplateRoutes from "./modules/template/template.route";
import { templateSchemas } from "./modules/template/template.schema";
import { Route } from "./types/modules";
import { withRefResolver } from "fastify-zod";
import fastifySwagger from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      ADDR: string;
      PORT: number;
      ALLOWED_IPS: string;
      VERSION: string;
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

    App.registerSwagger();
    await App.server.after();

    App.initAPIRoutes([new TemplateRoutes()]);
    App.attachErrorHandler();
  }

  public async listen() {
    await this.bootstrap();
    await App.server.ready();
    App.server.swagger();

    const { PORT, ADDR } = App.server.config;

    return App.server.listen({ port: PORT, host: ADDR });
  }

  public getServer() {
    return App.server;
  }

  private static async configureCors() {
    let corsConf: string | string[] = "*";

    const configAllowedIPs = App.server.config.ALLOWED_IPS;
    if (configAllowedIPs != "") {
      const splitIps = configAllowedIPs?.split(",");
      if (splitIps?.length > 0) {
        corsConf = splitIps?.map((ip) => ip?.trim());
      }
    }

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
      console.error("error: ", err.message);
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
        prefix: `api/v${App.server.config.VERSION}/${route.prefix}`,
      });
    });
  }

  private static registerSwagger() {
    App.server.register(
      fastifySwagger,
      withRefResolver({
        routePrefix: "/docs",
        exposeRoute: true,
        staticCSP: true,
        swagger: {
          info: {
            title: "Fastify API",
            description: "API for some products",
            version: App.server.config.VERSION,
          },
          schemes: ["http"],
          consumes: ["application/json"],
          produces: ["application/json"],
        },
      })
    );

    App.server.register(fastifySwaggerUi, {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "list",
        deepLinking: false,
      },
    });
  }
}
