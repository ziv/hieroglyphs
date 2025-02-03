import opts from "../tmp/opts.json" with { type: "json" };

const kv = await Deno.openKv(opts.kv);
