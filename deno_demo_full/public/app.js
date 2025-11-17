// Get references to DOM elements we'll be interacting with
const list = document.getElementById("list");
const note = document.getElementById("text");
const form = document.getElementById("form");
const slugBtn = document.getElementById("slug-btn");

// Track slug mode state on the client side (synced with server)
let slugMode = false;

// Fetch all notes from the API and display them
async function loadNotes() {
  const notes = await (await fetch("/api/notes")).json();
  render(notes);
}

// Convert a timestamp to a human-readable date/time string
function formatTimestamp(ms) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ms));
}

// Render the list of notes to the page
function render(notes) {
  // Clear the existing list content
  list.innerHTML = "";
  
  // Create a list item for each note
  notes.forEach((n) => {
    const li = document.createElement("li");

    // Create a container for the note text and timestamp
    const contentSpan = document.createElement("span");
    contentSpan.textContent = `${n.text}`;

    // Add a line break between the note text and timestamp
    const br = document.createElement("br");
    contentSpan.appendChild(br);

    // Create a styled span for the timestamp (smaller, gray text)
    const timeSpan = document.createElement("span");
    timeSpan.className = "timestamp";
    timeSpan.textContent = formatTimestamp(n.createdAt);

    contentSpan.appendChild(timeSpan);
    li.appendChild(contentSpan);

    // Create a delete button for each note
    const btn = document.createElement("button");
    btn.textContent = "🗑️";
    
    // When clicked, delete the note and refresh the list
    btn.onclick = async () => {
      await fetch(`/api/notes/${n.id}`, { method: "DELETE" });
      loadNotes();
    };

    li.appendChild(btn);
    list.appendChild(li);
  });
}

// Handle form submission to create a new note
form.onsubmit = async (e) => {
  // Prevent the default form submission (page reload)
  e.preventDefault();
  const text = note.value.trim();
  // Don't create empty notes
  if (!text) return;

  // Send a POST request to create the new note
  await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  // Clear the note field and refresh the notes list
  note.value = "";
  loadNotes();
};

// Handle slug mode toggle button click
slugBtn.onclick = async () => {
  // Toggle slug mode on the server
  const res = await fetch("/api/toggle-slug", { method: "POST" });
  const data = await res.json();
  // Update local state and button text to reflect current mode
  slugMode = data.slugMode;
  slugBtn.textContent = `Slug Mode: ${slugMode ? "ON" : "OFF"}`;
};

// Load notes when the page first loads
loadNotes();
