import path from "node:path";
import { createServer } from "./index";
import * as express from "express";

const app = createServer();
const port = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Proxy /api to Spring Boot backend
app.use("/api", async (req, res) => {
  try {
    const targetUrl = `${BACKEND_URL}/api${req.url}`;
    const headers = { ...req.headers };
    delete headers.host;

    const fetchOptions = {
      method: req.method,
      headers
    };

    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
      headers["content-type"] = "application/json";
    }

    const backendRes = await fetch(targetUrl, fetchOptions);
    res.status(backendRes.status);
    backendRes.headers.forEach((val, key) => {
      if (key !== "content-encoding" && key !== "content-length") {
        res.setHeader(key, val);
      }
    });

    const buffer = Buffer.from(await backendRes.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    console.error("API proxy error:", err.message);
    res.status(502).json({ error: "Backend service unreachable", details: err.message });
  }
});

// Serve static files
app.use(express.static(distPath));

// Handle React Router - serve index.html for all non-API routes
app.use((req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 YoSoyFrontend server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 Backend Target: ${BACKEND_URL}`);
  console.log(`🔧 API Proxy: http://localhost:${port}/api -> ${BACKEND_URL}/api`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
