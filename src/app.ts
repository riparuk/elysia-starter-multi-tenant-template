import { Elysia } from "elysia";
import { auth } from "./lib/auth";
import { openapi } from "@elysiajs/openapi";
import { OpenAPI } from "./lib/auth";

export const app = new Elysia()
  .use(openapi({
    documentation: {
      components: await OpenAPI.components,
      paths: await OpenAPI.getPaths()
    }
  }))
  .mount("/auth", auth.handler)
