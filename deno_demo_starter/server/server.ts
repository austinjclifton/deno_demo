import { serveDir } from "@std/file_server";

Deno.serve((req) => {
  return serveDir(req, { fsRoot: "public" });
});
