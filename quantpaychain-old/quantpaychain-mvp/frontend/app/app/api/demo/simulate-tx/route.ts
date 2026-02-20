
import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";

export async function POST() {
  try {
    const now = Date.now().toString();
    const rnd = crypto.randomBytes(16).toString("hex");
    const txHash = "0x" + crypto.createHash("sha256").update(now + rnd).digest("hex").slice(0, 64);
    const payload = { txHash, status: "confirmed", timestamp: new Date().toISOString() };

    try {
      const evidenceDir = path.resolve(process.cwd(), "evidence");
      if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir);
      fs.appendFileSync(
        path.join(evidenceDir, "demo-interaction.log"),
        JSON.stringify({ event: "tx_simulated", payload }) + "\n"
      );
    } catch (err: any) {
      console.log("Could not write evidence in serverless environment:", err?.message || err);
    }

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
