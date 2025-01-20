const addBtn = document.querySelector("#addBtn");
const main = document.querySelector("#main");

// Click event listener for the Add Note button
addBtn.addEventListener("click", function () {
    addNote();
});

// Save Notes to LocalStorage
const saveNotes = () => {
    const notes = document.querySelectorAll(".note .content");
    const titles = document.querySelectorAll(".note .title");
    const data = [];

    notes.forEach((note, index) => {
        const content = note.value.trim();
        const title = titles[index].value.trim();
        if (content !== "" || title !== "") {
            data.push({ title, content });
        }
    });

    // Save data to LocalStorage
    localStorage.setItem("notes", JSON.stringify(data));
};

// Add a new note
const addNote = (text = "", title = "") => {
    const note = document.createElement("div");
    note.classList.add("note");

    note.innerHTML = `
        <div class="icons">
            <i class="share fa-solid fa-arrow-up-from-bracket"></i>
            <i class="fa-solid fa-file-arrow-down"></i>
            <i class="save fas fa-save"></i>
            <i class="trash fas fa-trash"></i>
        </div>
        <textarea class="title" placeholder="Title">${title}</textarea>
        <textarea class="content" placeholder="Note down your thoughts ...">${text}</textarea>
    `;

    main.appendChild(note);

    const shareBtn = note.querySelector(".share");
    const saveButton = note.querySelector(".save");
    const delBtn = note.querySelector(".trash");

    // Delete Note
    delBtn.addEventListener("click", () => {
        note.remove();
        saveNotes();
    });

    // Save Note
    saveButton.addEventListener("click", saveNotes);

    // Share Note
    shareBtn.addEventListener("click", async () => {
        try {
            const title = note.querySelector(".title").value.trim();
            const content = note.querySelector(".content").value.trim();
            const data = { title, text: content };

            // Use the Web Share API if supported
            if (navigator.share) {
                await navigator.share(data);
                alert("Shared successfully!");
            } else {
                alert("Web Share API is not supported on this browser.");
            }
        } catch (err) {
            console.error(`Error sharing: ${err}`);
            alert(`Error sharing: ${err}`);
        }
    });

    saveNotes();
};

// loadotes from LocalStorage
function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    savedNotes.forEach((note) => {
        addNote(note.content, note.title);
    });
}

loadNotes();
