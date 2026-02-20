
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    let parsed: any;
    try {
      parsed = JSON.parse(body);
    } catch {
      parsed = { raw: body };
    }
    const evidenceDir = path.resolve(process.cwd(), "evidence");
    try {
      if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir);
      fs.appendFileSync(
        path.join(evidenceDir, "demo-interaction.log"),
        JSON.stringify({ ts: new Date().toISOString(), event: parsed }) + "\n"
      );
    } catch (e: any) {
      console.log("Could not write evidence:", e?.message || e);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
