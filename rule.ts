import { info, warn } from "@xpr/sat/std/log";

export type ClickRule = {
  // identifiers
  type: "click-rule";
  id: string;

  // metadata
  description: string;

  // matchers
  cssPath: string;
  route: string;
};

const kv = await Deno.openKv();

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

export async function getRules(host: string) {
  const res = await kv.get<ClickRule[]>(["rules", host]);
  if (!res.value) {
    warn("no rules found");
    return [];
  }
  info(`${res.value} rules found for host ${host}`);
  return res.value;
}

export async function saveRule(host: string, rule: ClickRule) {
  const rules = await getRules(host);
  rules.push(rule);
  await kv.set(["rules", host], rules);
  info("rule saved", rule, host);
  return true;
}
