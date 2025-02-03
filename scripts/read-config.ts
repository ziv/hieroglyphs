import opts from "../tmp/opts.json" with { type: "json" };

const kv = await Deno.openKv(opts.kv);
const list = kv.list({ prefix: ["rules"] });

for await (const entry of list) {
  console.log(entry.key, entry.value);
}
