import { ClickRule } from "./rule.ts";

const isRule = (i: unknown): i is ClickRule =>
  typeof i === "object" && i !== null && "id" in i && "cssPath" in i && "route" in i && "type" in i;

export function cors(res: Response) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "*");
  res.headers.set("Access-Control-Max-Age", "86400");
  return res;
}

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
  return cors(
    new Response(JSON.stringify(data), {
      status,
      headers: {
        "content-type": "application/json",
      },
    }),
  );
}

export function notFound() {
  return json({ message: "not-found" }, 404);
}
