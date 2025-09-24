const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Root route -> pair.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pair.html"));
});

// Handle 404 (Not Found)
app.use((req, res) => {
  res.status(404).send("Page Not Found 😢");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
