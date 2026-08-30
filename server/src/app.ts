import Fastify, { type FastifyInstance } from "fastify";
import { registerRoutes } from "./routes";
import type { ContentStore } from "./store";

export async function buildEditingApp(store: ContentStore): Promise<FastifyInstance> {
  const app = Fastify({ logger: false });
  const adminOrigin = process.env.KELLOS_ADMIN_ORIGIN;

  app.addHook("onSend", async (_request, reply, payload) => {
    if (adminOrigin) {
      reply.header("Access-Control-Allow-Origin", adminOrigin);
      reply.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
      reply.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
    }
    return payload;
  });

  app.options("*", async (_request, reply) => {
    if (adminOrigin) {
      reply.header("Access-Control-Allow-Origin", adminOrigin);
      reply.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
      reply.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
    }
    return reply.code(204).send();
  });

  await registerRoutes(app, store);
  return app;
}
