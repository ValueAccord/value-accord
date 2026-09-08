import { readFile } from "node:fs/promises";
import { verifyDemoPacket } from "../apps/website/lib/browser-sandbox.ts";

const filename = process.argv[2];
if (!filename) {
  console.error("Usage: node scripts/verify-demo-receipt.mjs /path/to/receipt.json");
  process.exitCode = 1;
} else {
  try {
    const receipt = JSON.parse(await readFile(filename, "utf8"));
    const valid = await verifyDemoPacket(receipt.packet);
    if (!valid) throw new Error("Invalid demo packet signature.");
    console.log("Valid Ed25519 signature for packet.payload using the included demo key.");
    console.log("This does not authenticate participant identity, settlement, or unsigned receipt annotations.");
  } catch (cause) {
    console.error(cause instanceof Error ? cause.message : "Could not verify the demo packet.");
    process.exitCode = 1;
  }
}
