import * as log from "@std/log";
import { ClickRule } from "./rule.ts";

export function validate(i: unknown): ClickRule {
  if (!(typeof i === "object" && i !== null && "id" in i && "cssPath" in i && "route" in i && "type" in i)) {
    throw new Error("invalid rule");
  }
  if ("click-rule" !== i.type) {
    throw new Error("wrong type");
  }
  const { id, type, cssPath, description, route } = i as ClickRule;
  return { id, type, cssPath, description, route };
}

export async function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(await data), {
    status,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export function notFound() {
  return json({ message: "not-found" }, 404);
}

export async function onError(f: () => Promise<Response>) {
  try {
    return await f();
  } catch (err) {
    log.error(String(err), (err as Error)?.stack);
    return json({ message: "internal-error" }, 500);
  }
}
