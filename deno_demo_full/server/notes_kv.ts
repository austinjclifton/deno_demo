// Open a connection to Deno KV (key-value database) - this is Deno's built-in database
// The await at the top level is allowed in Deno modules
export const kv = await Deno.openKv();

// Create a new note and save it to the database
export async function addNote(text: string) {
  // Generate a unique ID for the note
  const id = crypto.randomUUID();
  // Create the note object with id, text, and current timestamp
  const note = { id, text, createdAt: Date.now() };
  // Save the note to KV using a composite key
  await kv.set(["note", id], note);

  return note;
}

// Delete a note from the database by its ID
export async function deleteNote(id: string) {
  // Remove the note from KV using the same key structure as when it was created
  await kv.delete(["note", id]);
}

// Retrieve all notes from the database
export async function listNotes() {
  const notes: Array<{ id: string; text: string; createdAt: number }> = [];
  // Iterate through all entries in KV that have the "note" prefix
  // Deno KV uses key prefixes to organize data (e.g., ["note", "id-123"])
  for await (const entry of kv.list({ prefix: ["note"] })) {
    notes.push(entry.value as { id: string; text: string; createdAt: number });
  }
  // Sort notes by creation date, newest first (descending order)
  return notes.sort((a, b) => b.createdAt - a.createdAt);
}

