import { FastifyReply, FastifyRequest } from "fastify";
import ClientException from "../exceptions/ClientException";

export default async function protectWithApikey(
  request: FastifyRequest,
  _: FastifyReply,
  done: () => void
) {
  const apiKey = request.headers["x-api-key"];
  console.log("================ Called");

  if (!apiKey || apiKey != process.env.API_KEY) {
    throw new ClientException("Sorry, you can't access this route", 401);
  }

  done();
}
