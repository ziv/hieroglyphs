import { type Route, route } from "@std/http/unstable-route";
import dispatcher from "@xpr/http-kv/dispatcher";
import { errorlog, info } from "@xpr/sat/std/log";
import { cors, json, notFound } from "@xpr/sat/http/res";
import type { JWTPayload } from "jose";
import { jwtVerify } from "jose";
import { getRules, saveRule, validate } from "./rule.ts";

async function authenticate(req: Request): Promise<JWTPayload> {
  const secret = Deno.env.get("KV_SECRET");
  if (!secret) {
    throw new Error("KV_SECRET is required");
  }
  if (secret.length < 32) {
    throw new Error("KV_SECRET must be at least 32 characters");
  }
  const token = req.headers.get("RPC_KV_AUTHORIZATION");
  if (!token) {
    throw new Error("Missing token");
  }
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(secret),
  );
  return payload;
}

const routes: Route[] = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/rules/:host" }),
    handler: async (_r, params) => {
      try {
        const host = params?.pathname.groups.host as string;
        return await json(getRules(host), 200, cors());
      } catch (err) {
        errorlog("error getting rules", { err, stack: (err as Error)?.stack });
        return json({ message: "internal-error" }, 500);
      }
    },
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/rules/:host" }),
    handler: async (r, params) => {
      try {
        const rule = validate(await r.json());
        const host = params?.pathname.groups.host as string;
        return await json(saveRule(host, rule), 200, cors());
      } catch (err) {
        errorlog("error saving rules", { err, stack: (err as Error)?.stack });
        return json({ message: "internal-error" }, 500);
      }
    },
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/rpc" }),
    handler: async (r) => {
      try {
        await authenticate(r);
        return json(dispatcher(await r.json()));
      } catch (err) {
        errorlog("rpc error", { err, stack: (err as Error)?.stack });
        return json({ message: "internal-error" }, 500);
      }
    },
  },
];

Deno.serve(route(routes, notFound));
info("server started");
