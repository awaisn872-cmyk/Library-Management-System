// ----------------------------
// Library Management Script
// ----------------------------

// Utility: Get all books from localStorage
function getBooks() {
    return JSON.parse(localStorage.getItem('books')) || [];
}

// ----------------------------
// Add Book
// ----------------------------
function addBook() {
    const id = parseInt(document.getElementById('addID').value);
    const name = document.getElementById('addName').value.trim();
    const msg = document.getElementById('addMsg');

    if (!id || !name) {
        msg.innerText = "⚠ Please enter both ID and Name!";
        msg.style.color = "red";
        return;
    }

    let books = getBooks();

    // Check if ID already exists
    if (books.find(b => b.id === id)) {
        msg.innerText = "⚠ Book ID already exists!";
        msg.style.color = "red";
        return;
    }

    books.push({ id, name });
    localStorage.setItem('books', JSON.stringify(books));

    msg.innerText = "✅ Book Added Successfully!";
    msg.style.color = "green";

    document.getElementById('addID').value = '';
    document.getElementById('addName').value = '';
}

// ----------------------------
// Display All Books
// ----------------------------
function displayBooks() {
    const bookList = document.getElementById('bookList');
    if (!bookList) return; // In case the page doesn't have a display section

    const books = getBooks();
    bookList.innerHTML = '';

    if (books.length === 0) {
        bookList.innerHTML = '<p>No books available!</p>';
        return;
    }

    books.forEach(book => {
        const div = document.createElement('div');
        div.className = 'book-card';
        div.innerHTML = `<strong>ID:</strong> ${book.id}<br><strong>Name:</strong> ${book.name}`;
        bookList.appendChild(div);
    });
}

// ----------------------------
// Search Book by ID
// ----------------------------
function searchBook() {
    const id = parseInt(document.getElementById('searchID').value);
    const result = document.getElementById('searchResult');
    const books = getBooks();

    const book = books.find(b => b.id === id);

    if (book) {
        result.innerText = `✅ Book Found!\nID: ${book.id}, Name: ${book.name}`;
        result.style.color = "green";
    } else {
        result.innerText = "❌ Book Not Found!";
        result.style.color = "red";
    }
}

// ----------------------------
// Issue Book by ID
// ----------------------------
function issueBook() {
    const id = parseInt(document.getElementById('issueID').value);
    const result = document.getElementById('issueResult');
    let books = getBooks();

    const index = books.findIndex(b => b.id === id);

    if (index !== -1) {
        result.innerText = `✅ Book Issued Successfully!\nID: ${books[index].id}, Name: ${books[index].name}`;
        result.style.color = "green";

        // Optional: Remove book after issuing
        // books.splice(index, 1);
        // localStorage.setItem('books', JSON.stringify(books));

    } else {
        result.innerText = "❌ Book Not Found!";
        result.style.color = "red";
    }
}

// ----------------------------
// Optional: Clear All Books (for testing)
// ----------------------------
function clearLibrary() {
    localStorage.removeItem('books');
    alert("Library cleared!");
    displayBooks();
}