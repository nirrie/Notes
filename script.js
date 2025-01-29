const addBtn = document.querySelector("#addBtn");
const main = document.querySelector("#main");
let lastScrolly = window.scrollY;
let scrollTimeout;

// sidebar, use js because it's dynamic for the user
const sidebar = document.createElement("div");
sidebar.classList.add("sidebar");
document.body.appendChild(sidebar);

// sidebar hover detection on large screens (desktop)
const sidebarHover = (e) => {
    if (window.innerWidth >= 768) {
        if (e.clientX < 50) {
            sidebar.style.transform = "translateX(0)";
        }
    }
};    

//Hide sidebar when the mouse leaves the sidebar
sidebar.addEventListener("mouseenter", () => {
    sidebar.style.transform = "translateX(0)";
});

// Show sidebar when the mouse enters the sidebar
sidebar.addEventListener("mouseleave", () => {
    sidebar.style.transform = "translateX(-100%)";
});

window.addEventListener("mousemove", sidebarHover);

// Add the "Add Note" button inside the sidebar
const sidebarAddButton = document.createElement("button");
sidebarAddButton.id = "addBtn";
sidebarAddButton.textContent = "Add Note";
sidebar.appendChild(sidebarAddButton);

// update sidebar
const updateSidebar = () => {
    sidebar.innerHTML = "";
    const notes = document.querySelectorAll(".note .title");

    // Add the "Add Note" button to the sidebar again after it gets removed during scrolling
    sidebar.appendChild(sidebarAddButton);
    
    notes.forEach((note, index) => {
        const titleText = note.value.trim() || `Note ${index + 1}`;
        const sidebarItem = document.createElement("div");
        sidebarItem.classList.add("sidebar-item");
        sidebarItem.textContent = titleText;

        sidebarItem.addEventListener("click", () => {
            note.parentElement.scrollIntoView({ behavior: "smooth" });
        });

        sidebar.appendChild(sidebarItem);
    });
};

// Function the hide sidebar after 3 seconds
const hideSidebar = () => {
    sidebar.style.transform = "translateX(-100%)"; // Hide sidebar
    sidebarAddButton.style.opacity = "0"; // Hide add note button
    sidebarAddButton.style.pointerEvents = "none"; // disable button
};

// Scroll event function
const sidebarScroll = () => {
    const currentScrollY = window.scrollY;

    clearTimeout(scrollTimeout); // 

    // Scroll down to hide the sidebar
    if (currentScrollY > lastScrolly) {
        hideSidebar();
    } else {
        // Scroll up to show the sidebar
        sidebar.style.transform = "translateX(0)"; // Show sidebar
        sidebarAddButton.style.opacity = "1"; // Show button
        sidebarAddButton.style.pointerEvents = "auto"; // button enable
    }

    // set timer to hide sidebar when stop scrolling
    scrollTimeout = setTimeout(hideSidebar, 3000);

    lastScrolly = currentScrollY; // Update scroll position
};

// Event listener voor scrolling
window.addEventListener("scroll", sidebarScroll);

// Set timer 
scrollTimeout = setTimeout(hideSidebar, 3000);

// scroll event listener
window.addEventListener("scroll", sidebarScroll);

// Click event listener for the Add Note button inside the sidebar
sidebarAddButton.addEventListener("click", function () {
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
updateSidebar();
