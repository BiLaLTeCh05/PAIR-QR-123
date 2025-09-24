import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import P from "pino";

// Random session ID generator
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

  // Connection listener
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
