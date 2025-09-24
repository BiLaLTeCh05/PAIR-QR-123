import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import P from "pino";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (pair.html, pair.js)
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ===================
// WhatsApp BOT LOGIC
// ===================
function generateSessionId(prefix = "BILAL-MD~", len = 56) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return prefix + out;
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    printQRInTerminal: true,
    auth: state,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection } = update;
    if (connection === "open") {
      const sessionId = generateSessionId();
      const msg = "✅ Your bot has been linked successfully!";
      await sock.sendMessage(sock.user.id, {
        text: `🔑 Session ID:\n${sessionId}\n\n💬 ${msg}`
      });
      console.log("Bot linked & session ID sent to WhatsApp!");
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

startBot();
