
const fs = require("fs");
const path = require("path");

(async () => {
  const base = "http://localhost:3000";
  const evidenceDir = path.resolve(process.cwd(), "frontend/app/evidence");
  if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir, { recursive: true });
  const logPath = path.join(evidenceDir, "demo-interaction.log");
  
  try {
    // Note: This requires node-fetch for Node < 18
    const fetch = globalThis.fetch || require("node-fetch");
    
    await fetch(base + "/api/demo/event", {
      method: "POST",
      body: JSON.stringify({ event: "wallet_created", payload: { address: "0xtest" } })
    });
    
    const txRes = await fetch(base + "/api/demo/simulate-tx", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ from: "0xtest" })
    });
    
    const txJson = await txRes.json();
    fs.appendFileSync(
      logPath,
      JSON.stringify({ ts: new Date().toISOString(), stage: "test_script", tx: txJson }) + "\n"
    );
    
    console.log("Demo test ok", txJson.txHash || txJson);
    process.exit(0);
  } catch (err) {
    fs.appendFileSync(
      logPath,
      JSON.stringify({ ts: new Date().toISOString(), error: String(err) }) + "\n"
    );
    console.error("Demo test failed", err);
    process.exit(2);
  }
})();
