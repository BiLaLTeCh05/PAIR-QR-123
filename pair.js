// ==============================
// CONFIG
// ==============================
const API_URL = "https://kaiz-apis.gleeze.com/api/pairing"; 
// 👆 yahan apni API ka endpoint daalna hai


// ==============================
// SESSION ID GENERATOR
// ==============================
function generateSessionId(prefix = 'BILAL-MD~', suffixLength = 56) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#-_';
  const charsLen = chars.length;
  try {
    const array = new Uint8Array(suffixLength);
    window.crypto.getRandomValues(array);
    let out = '';
    for (let i = 0; i < suffixLength; i++) {
      out += chars[array[i] % charsLen];
    }
    return prefix + out;
  } catch (e) {
    let out = '';
    for (let i = 0; i < suffixLength; i++) {
      out += chars[Math.floor(Math.random() * charsLen)];
    }
    return prefix + out;
  }
}


// ==============================
// PAIRING REQUEST
// ==============================
async function requestPair() {
  const inputEl = document.getElementById('numberInput');
  const sessionEl = document.getElementById('sessionId');
  const codeEl = document.getElementById('pairCode');
  const msgEl = document.getElementById('extraMsg');

  const number = inputEl.value.trim();
  if (!/^\d{10,15}$/.test(number)) {
    alert("Please enter a valid number without + sign (e.g. 923001234567)");
    return;
  }

  // generate session ID
  const sessionId = generateSessionId();
  sessionEl.textContent = sessionId;

  try {
    const url = `${API_URL}?number=${encodeURIComponent(number)}&session=${encodeURIComponent(sessionId)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("API Error");
    const data = await res.json();

    codeEl.textContent = data.code || "Not received";
    msgEl.textContent = data.message || "Use this code in your WhatsApp within 30 seconds!";
  } catch (err) {
    codeEl.textContent = "—";
    msgEl.textContent = "Error: Could not fetch pairing code. Try again later.";
  }
}
