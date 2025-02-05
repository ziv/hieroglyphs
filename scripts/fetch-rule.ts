#!/usr/bin/env -S deno run -A --unstable-kv
import { HttpKv } from "@xpr/http-kv";
import { SignJWT } from "npm:jose@5.9.6";

const token = await new SignJWT({ email: "dummy" })
  .setProtectedHeader({ alg: "HS256" })
  .setIssuedAt()
  .setExpirationTime("1h")
  .sign(new TextEncoder().encode(Deno.env.get("KV_SECRET")));

console.log(await new HttpKv("https://hieroglyphs.deno.dev/rpc", token).get(Deno.args));