const addBtn = document.querySelector("#addBtn");
const main = document.querySelector("#main");
let lastScrolly = window.scrollY;

// function to hide or show Add Note button
const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrolly) {
        // scroll down
        addBtn.style.opacity = "0";
        addBtn.style.pointerEvents = "none";
    } else {
        // scroll up
        addBtn.style.opacity = "1";
        addBtn.style.pointerEvents = "auto";
    }

    lastScrolly = currentScrollY;
};

// scroll event listener
window.addEventListener("scroll", handleScroll);

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
            <i class="text fa-solid fa-file-arrow-down"></i>
            <i class="save fas fa-save"></i>
            <i class="trash fas fa-trash"></i>
        </div>
        <textarea class="title" placeholder="Title">${title}</textarea>
        <textarea class="content" placeholder="Note down your thoughts ...">${text}</textarea>
    `;

    main.appendChild(note);

    const shareBtn = note.querySelector(".share");
    const textBtn = note.querySelector(".text");
    const saveButton = note.querySelector(".save");
    const delBtn = note.querySelector(".trash");

    const downloadNoteAsText = () => {
        const noteTitle = note.querySelector(".title").value.trim();
        const noteContent = note.querySelector(".content").value.trim();
        const textContent = `Title: ${noteTitle || "Untitled Note"}\n\n${noteContent}`;
        const blob = new Blob([textContent], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = noteTitle ? `${noteTitle}.txt` : "note.txt";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Delete Note
    delBtn.addEventListener("click", () => {
        note.remove();
        saveNotes();
    });

    // Save Note
    saveButton.addEventListener("click", saveNotes);

    // Download Note as a .txt file
    textBtn.addEventListener("click", downloadNoteAsText);

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
