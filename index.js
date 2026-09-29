const http = require("node:http");
const next = require("next");

const port = Number.parseInt(process.env.PORT || "5000", 10);
const host = process.env.HOST || "0.0.0.0";
const dev = process.env.NODE_ENV !== "production";

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

const app = next({ dev, hostname: host, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = http.createServer((request, response) => handle(request, response));

    server.on("error", (error) => {
      console.error("[M-TUBE] Server error:", error);
      process.exitCode = 1;
    });

    server.listen(port, host, () => {
      console.log(`[M-TUBE] ${dev ? "Development" : "Production"} server ready at http://${host}:${port}`);
    });
  })
  .catch((error) => {
    console.error("[M-TUBE] Failed to start Next.js:", error);
    process.exitCode = 1;
  });