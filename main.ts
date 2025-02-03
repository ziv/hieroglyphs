import { type Route, route } from "@std/http/unstable-route";
import * as log from "@std/log";
import { json, notFound, onError, validate } from "./utils.ts";
import type { ClickRule } from "./rule.ts";

log.setup({
  handlers: {
    default: new log.ConsoleHandler("DEBUG", {
      formatter: log.formatters.jsonFormatter,
      useColors: false,
    }),
  },
});

const kv = await Deno.openKv();

async function getRules(host: string) {
  const res = await kv.get<ClickRule[]>(["rules", host]);
  if (!res.value) {
    log.warn("no rules found");
    return [];
  }
  log.info(`${res.value} rules found for host ${host}`);
  return res.value;
}

async function saveRule(host: string, rule: ClickRule) {
  const rules = await getRules(host);
  rules.push(rule);
  await kv.set(["rules", host], rules);
  log.info("rule saved", rule, host);
  return true;
}

const routes: Route[] = [
  {
    method: "get",
    pattern: new URLPattern({ pathname: '/rules/:host' }),
    handler: (_r, params) => onError(() => json(getRules(params?.pathname.groups.host as string))),
  },
  {
    method: "post",
    pattern: new URLPattern({ pathname: "/rules/:host" }),
    handler: (r, params) =>
      onError(async () => json(saveRule(params?.pathname.groups.host as string, validate(await r.json())))),
  },
];

Deno.serve(route(routes, (req) => notFound(req)));
log.info("server started");
