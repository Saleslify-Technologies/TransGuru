import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const outputDirectory = path.join(projectDirectory, "dist");
const port = Number.parseInt(process.env.PORT ?? "4173", 10);
const requestedBase = process.env.BASE_PATH ?? "/TransGuru/";
const basePath = `/${requestedBase.replace(/^\/+|\/+$/g, "")}/`;

const contentTypes = new Map([
  [".avif", "image/avif"],
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webmanifest", "application/manifest+json"],
  [".webp", "image/webp"],
  [".xml", "application/xml; charset=utf-8"]
]);

function send(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    ...headers
  });
  response.end(body);
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? "/", "http://localhost");
  if (requestUrl.pathname === "/" || requestUrl.pathname === basePath.slice(0, -1)) {
    response.writeHead(302, { Location: basePath });
    response.end();
    return;
  }

  if (!requestUrl.pathname.startsWith(basePath)) {
    send(response, 404, "Not found");
    return;
  }

  let relativePath;
  try {
    relativePath = decodeURIComponent(requestUrl.pathname.slice(basePath.length));
  } catch {
    send(response, 400, "Invalid URL");
    return;
  }

  if (relativePath === "" || relativePath.endsWith("/")) relativePath += "index.html";
  const filePath = path.resolve(outputDirectory, relativePath);
  const relativeToOutput = path.relative(outputDirectory, filePath);
  if (relativeToOutput.startsWith("..") || path.isAbsolute(relativeToOutput)) {
    send(response, 403, "Forbidden");
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error("Not a file");
    response.writeHead(200, {
      "Cache-Control": "no-cache",
      "Content-Length": fileStat.size,
      "Content-Type": contentTypes.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream"
    });
    createReadStream(filePath).pipe(response);
  } catch {
    send(response, 404, "Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Preview available at http://127.0.0.1:${port}${basePath}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
