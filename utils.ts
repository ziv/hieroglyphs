import { ClickRule } from "./rule.ts";

export function validate(input: unknown): ClickRule {
  if (typeof input !== "object" || input === null) {
    throw new Error("invalid input");
  }
  if (
    !("id" in input) || !("description" in input) || !("cssPath" in input) ||
    !("route" in input) || !("type" in input)
  ) {
    throw new Error("missing fields");
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
