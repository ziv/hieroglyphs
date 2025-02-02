import * as log from "@std/log";

log.setup({
  handlers: {
    default: new log.ConsoleHandler("DEBUG", {
      formatter: log.formatters.jsonFormatter,
      useColors: false,
    }),
  },
});

const json = (data: any, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });

Deno.serve(async (req) => {
  const kv = await Deno.openKv();
  const method = req.method.toLowerCase();
  if ("get" === method) {
    const rules = await kv.get(["rules"]);
    return json(rules.value);
  }
  if ("post" === method) {
    const body = await req.json();
    log.info("saving", body);
    await kv.set(["rules"], body);
    return json({ message: "ok" });
  }
  return json({ message: "not-found" }, 404);
});
