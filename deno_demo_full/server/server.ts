import { serveDir } from "@std/file_server";
import { addNote, deleteNote, listNotes } from "./notes_kv.ts";
import * as emoji from "@emoji";
import slugify from "slugify";

// Track whether slug mode is enabled (converts note text to URL-friendly format)
let slugMode = false;

// Main server handler (Deno.serve creates an HTTP server that handles all incoming requests)
Deno.serve(async (req) => {
  const url = new URL(req.url);

  // GET /api/notes
  if (url.pathname === "/api/notes" && req.method === "GET") {
    return json(await listNotes());
  }

  // POST /api/notes
  if (url.pathname === "/api/notes" && req.method === "POST") {
    const { text } = await req.json();

    // If slug mode is enabled, convert the text to a URL-friendly slug format
    const processedText = slugMode ? slugify.default(text, {
      lower: true,
      strict: true
    }) : text;

    // Add a random emoji to the beginning of each note
    const emojiChar = emoji.random().emoji;
    const note = await addNote(`${emojiChar} ${processedText}`);
    return json(note);
  }

  // DELETE /api/notes/:id
  if (url.pathname.startsWith("/api/notes/") && req.method === "DELETE") {
    const id = url.pathname.split("/").at(-1)!; // obtain the note id from the url
    await deleteNote(id);
    return json({ ok: true });
  }

  // POST /api/toggle-slug
  if (url.pathname === "/api/toggle-slug" && req.method === "POST") {
    slugMode = !slugMode;
    return json({ slugMode });
  }

   // GET /api/slug-mode
  if (url.pathname === "/api/slug-mode" && req.method === "GET") {
    return json({ slugMode });
  }

  // Static files - If no API route matches, serve static files from the public directory
  // This handles requests for HTML, CSS, JS, images, etc.
  return serveDir(req, { fsRoot: "public" });
});

// Helper function to create JSON responses with proper headers
function json(data: unknown) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
