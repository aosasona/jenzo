import { FastifyReply, FastifyRequest } from "fastify";

export default async function protectWithApikey(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const apiKey = request.headers["x-api-key"];

  if (!apiKey || apiKey != process.env.API_KEY) {
    return reply
      .code(401)
      .send({ ok: false, message: "Sorry, you can't access this route" });
  }
  return;
}
