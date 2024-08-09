/**
 * [
 *    {
 *      id: 3657848524,
 *      title: 'Harry Potter and the Philosopher\'s Stone',
 *      author: 'J.K Rowling',
 *      year: 1997,
 *      isComplete: false,
 *    }
 * ]
 */

document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  const inputBookTitle = document.getElementById("inputBookTitle");
  const inputBookAuthor = document.getElementById("inputBookAuthor");
  const inputBookYear = document.getElementById("inputBookYear");
  const inputBookIsComplete = document.getElementById("inputBookIsComplete");

  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  function createBookshelfItem(id, title, author, year, isComplete) {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.dataset.id = id;

    const titleElement = document.createElement("h3");
    titleElement.innerText = title;

    const authorElement = document.createElement("p");
    authorElement.innerText = `Penulis: ${author}`;

    const yearElement = document.createElement("p");
    yearElement.innerText = `Tahun: ${year}`;

    const actionDiv = document.createElement("div");
    actionDiv.classList.add("action");

    const toggleButton = document.createElement("button");
    toggleButton.classList.add(isComplete ? "green" : "red");
    toggleButton.innerText = isComplete
      ? "Belum selesai di Baca"
      : "Selesai dibaca";
    toggleButton.addEventListener("click", function () {
      const bookshelfList = isComplete
        ? incompleteBookshelfList
        : completeBookshelfList;
      const oppositeBookshelfList = isComplete
        ? completeBookshelfList
        : incompleteBookshelfList;

      toggleButton.classList.toggle("green");
      toggleButton.classList.toggle("red");
      toggleButton.innerText = isComplete
        ? "Selesai dibaca"
        : "Belum selesai di Baca";

      const bookItem = toggleButton.parentElement.parentElement;
      moveBookToShelf(bookItem, isComplete);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus buku";
    deleteButton.addEventListener("click", function () {
      const bookItem = deleteButton.parentElement.parentElement;
      const id = bookItem.dataset.id;
      bookItem.parentElement.removeChild(bookItem);
      removeBookFromLocalStorage(id);
    });

    actionDiv.appendChild(toggleButton);
    actionDiv.appendChild(deleteButton);

    bookItem.appendChild(titleElement);
    bookItem.appendChild(authorElement);
    bookItem.appendChild(yearElement);
    bookItem.appendChild(actionDiv);

    return bookItem;
  }

  function addBookToShelf(event) {
    event.preventDefault();

    const title = inputBookTitle.value;
    const author = inputBookAuthor.value;
    const year = inputBookYear.value;
    const isComplete = inputBookIsComplete.checked;

    const id = +new Date();
    const bookshelfList = isComplete
      ? completeBookshelfList
      : incompleteBookshelfList;

    const newBook = createBookshelfItem(id, title, author, year, isComplete);
    bookshelfList.appendChild(newBook);

    const bookData = {
      id: id,
      title: title,
      author: author,
      year: parseInt(year),
      isComplete: isComplete
    };

    addBookToLocalStorage(bookData);

    inputBookTitle.value = "";
    inputBookAuthor.value = "";
    inputBookYear.value = "";
    inputBookIsComplete.checked = false;
  }

  inputBookForm.addEventListener("submit", addBookToShelf);

  function addBookToLocalStorage(bookData) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    books.push(bookData);
    localStorage.setItem('books', JSON.stringify(books));
  }

  function removeBookFromLocalStorage(id) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    books = books.filter(book => book.id != id);
    localStorage.setItem('books', JSON.stringify(books));
  }

  function updateLocalStorage() {
    const incompleteBooks = Array.from(incompleteBookshelfList.querySelectorAll('.book_item')).map(bookItem => {
      return {
        id: bookItem.dataset.id,
        title: bookItem.querySelector('h3').innerText,
        author: bookItem.querySelector('p:nth-child(2)').innerText.replace('Penulis: ', ''),
        year: parseInt(bookItem.querySelector('p:nth-child(3)').innerText.replace('Tahun: ', '')),
        isComplete: false
      };
    });

    const completeBooks = Array.from(completeBookshelfList.querySelectorAll('.book_item')).map(bookItem => {
      return {
        id: bookItem.dataset.id,
        title: bookItem.querySelector('h3').innerText,
        author: bookItem.querySelector('p:nth-child(2)').innerText.replace('Penulis: ', ''),
        year: parseInt(bookItem.querySelector('p:nth-child(3)').innerText.replace('Tahun: ', '')),
        isComplete: true
      };
    });

    const allBooks = incompleteBooks.concat(completeBooks);
    localStorage.setItem('books', JSON.stringify(allBooks));
  }

  function loadBooksFromLocalStorage() {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    books.forEach(book => {
      const bookshelfList = book.isComplete ? completeBookshelfList : incompleteBookshelfList;
      bookshelfList.appendChild(createBookshelfItem(book.id, book.title, book.author, book.year, book.isComplete));
    });
  }

  // Fungsi untuk memindahkan buku dari satu rak ke rak lainnya
  function moveBookToShelf(bookItem, isComplete) {
      const bookshelfList = isComplete ? completeBookshelfList : incompleteBookshelfList;
      const oppositeBookshelfList = isComplete ? incompleteBookshelfList : completeBookshelfList;

      // Ambil data buku
      const id = bookItem.dataset.id;
      const title = bookItem.querySelector('h3').innerText;
      const author = bookItem.querySelector('p:nth-child(2)').innerText.replace('Penulis: ', '');
      const year = parseInt(bookItem.querySelector('p:nth-child(3)').innerText.replace('Tahun: ', ''));

      // Hapus buku dari rak sebelumnya
      bookshelfList.removeChild(bookItem);

      // Tambahkan buku ke rak yang sesuai
      oppositeBookshelfList.appendChild(createBookshelfItem(id, title, author, year, !isComplete));

      // Perbarui Local Storage
      updateLocalStorage();
  }

  // Tambahkan event listener untuk tombol "Selesai dibaca" di rak "Belum selesai dibaca"
  incompleteBookshelfList.addEventListener('click', function (event) {
      if (event.target.classList.contains('green')) {
          const bookItem = event.target.parentElement.parentElement;
          moveBookToShelf(bookItem, false);
      }
  });

  // Tambahkan event listener untuk tombol "Belum selesai di Baca" di rak "Selesai dibaca"
  completeBookshelfList.addEventListener('click', function (event) {
      if (event.target.classList.contains('red')) {
          const bookItem = event.target.parentElement.parentElement;
          moveBookToShelf(bookItem, true);
      }
  });

  loadBooksFromLocalStorage();
});
