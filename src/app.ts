import Fastify from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: string;
      ALLOWED_IPS: string;
    };
  }
}

export default class App {
  private static readonly server = Fastify();

  public getServer() {
    return App.server;
  }

  public addHealthCheck() {
    App.server.get("/health", async function(_, reply) {
      return reply.send({ ok: true });
    });
  }
}
