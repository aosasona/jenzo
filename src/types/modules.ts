import { FastifyInstance, FastifySchema } from "fastify";

export interface Route {
  readonly prefix: string;
  init(server: FastifyInstance, opts: any, done: any): void;
}

export type Schema = { schema: FastifySchema };
