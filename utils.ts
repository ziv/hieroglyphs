import { ClickRule } from "./rule.ts";

const isRule = (i: unknown): i is ClickRule =>
  typeof i === "object" && i !== null && "id" in i && "cssPath" in i && "route" in i && "type" in i;

export function validate(input: unknown): ClickRule {
  if (!isRule(input)) {
    throw new Error("invalid rule");
  }
  if ("click-rule" !== input.type) {
    throw new Error("wrong type");
  }
  const { id, type, cssPath, description, route } = input as ClickRule;
  return { id, type, cssPath, description, route };
}

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

export function notFound() {
  return json({ message: "not-found" }, 404);
}

export function cors() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400",
    },
  });
}
