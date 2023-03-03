import { FastifyInstance } from "fastify";

export interface Route {
  readonly prefix: string;
  init(server: FastifyInstance, opts: any, done: any): void;
}
