import * as log from "@std/log";
import { json, notFound, validate } from "./utils.ts";
import { RulesDoc } from "./rule.ts";

log.setup({
  handlers: {
    default: new log.ConsoleHandler("DEBUG", {
      formatter: log.formatters.jsonFormatter,
      useColors: false,
    }),
  },
});

const kv = await Deno.openKv();

Deno.serve(async (req) => {
  try {
    const { pathname, searchParams } = new URL(req.url);
    if (pathname === "/favicon.ico") { // stop hit this end point from browser
      return notFound();
    }
    const method = req.method.toLowerCase();
    log.info("incoming request", method, pathname);
    if ("options" === method) {
      return json({});
    }

    if ("post" === method) {
      const rule = validate(await req.json());
      const rules = await kv.get<RulesDoc>(["rules"]);
      if (rules.value && rules.value.rules.length > 100) {
        log.error("too many rules");
        return json({
          message: "too-many-rules, update owner (this is only POC)",
        }, 400);
      }
      if (rules.value) {
        rules.value.rules.push(rule);
        await kv.set(["rules"], rules.value);
      } else {
        await kv.set(["rules"], { version: "0", id: "dev", rules: [rule] });
      }
      log.info("rule saved", rule);
      return json({ message: "ok" });
    }

    if ("get" === method) {
      const rules = await kv.get<RulesDoc>(["rules"]);
      if (!rules.value) {
        log.warn("no rules found");
        return json([]);
      }
      const host = searchParams.get("host");
      if (!host) {
        log.info(`${rules.value.rules.length} rules found for all hosts`);
        return json(rules.value.rules);
      }
      const filtered = rules.value.rules.filter((r) => r.route === host);
      log.info(`${filtered.length} rules found for host ${host}`);
      return json(filtered);
    }
    return json({ message: "not-found" }, 404);
  } catch (err) {
    log.error(err);
    return json({ message: "internal-error" }, 500);
  }
});
