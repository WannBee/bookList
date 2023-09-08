const books = [];

    const RENDER_EVENT = 'render-books';
    const SAVED_EVENT = 'saved-books';
    const STORAGE_KEY = 'BOOK_APPS'; 

document.addEventListener('DOMContentLoaded', function (){
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
      }
});
    function addBook(){
        const Title = document.getElementById('inputBookTitle').value;
        const Author = document.getElementById('inputBookAuthor').value; 
        const Date = document.getElementById('inputBookYear').value;

        const bookID = bookId();
        const bookObject = generateBookObject(bookID, Title, Author, Date, false);
        books.push(bookObject);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
        }

    function bookId(){
        return +new Date();
    }

    function generateBookObject(id, title, author, date, isCompleted){
        return {
            id,
            title,
            author,
            date,
            isCompleted
        }
    }


    function isStorageExist() {
        if (typeof (Storage) === undefined) {
          alert('Browser kamu tidak mendukung local storage');
          return false;
        }
        return true;
      }
    
    function saveData(){
        if (isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

    function loadDataFromStorage(){
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);

        if (data !== null ){
            for (const book of data ){
                books.push(book);
            }
        }

        document.dispatchEvent(new Event(RENDER_EVENT));
    }


    
    document.addEventListener(RENDER_EVENT, function () {
        const uncomplitedREADList = document.getElementById('incompleteBookshelfList');
        uncomplitedREADList.innerHTML = '';
    
        const completedREADList = document.getElementById('completeBookshelfList');
        completedREADList.innerHTML = '';

        for (const bookItem of books){
            const bookElement = makeUnFinish(bookItem);
            if (!bookItem.isCompleted)
            uncomplitedREADList.append(bookElement);
            else
            completedREADList.append(bookElement);
        }
      });

      function makeUnFinish(bookObject){
        const textTitle = document.createElement('h2');
        textTitle.innerText = bookObject.title;

        const textAuthor = document.createElement('h3');
        textAuthor.innerText = bookObject.author;

        const textDate = document.createElement('p');
        textDate.innerText = bookObject.date;


        const textContainer = document.createElement('div');
        textContainer.append(textTitle, textAuthor, textDate);

        const container = document.createElement('div');
        container.append(textContainer);
        container.classList.add('book_item');
        container.setAttribute('id', 'buku-${bookObject.id}');

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('action');

        if (bookObject.isCompleted){
            const undoButton = document.createElement('button');
            undoButton.innerText = "UNFINISHED";
            undoButton.classList.add('white');
            
            undoButton.addEventListener('click', function(){
                undoTaskFromCompleted(bookObject.id);
            });

            const trashButton = document.createElement('button');
            trashButton.innerText = "DELETE";
            trashButton.classList.add('red');

            trashButton.addEventListener('click', function(){
                removeTaskFromComplited(bookObject.id);
            });

            buttonContainer.append(trashButton, undoButton);
        }else {
            const checkButton = document.createElement('button');
            checkButton.innerText = "FINISH";
            checkButton.classList.add('green');

            checkButton.addEventListener('click', function(){
                addTaskCompleted(bookObject.id);
            });

            const trashButton = document.createElement('button');
            trashButton.innerText = "DELETE";
            trashButton.classList.add('red');

            trashButton.addEventListener('click', function(){
                removeTaskFromComplited(bookObject.id);
        });
            buttonContainer.append(checkButton, trashButton);
        }
        container.append(buttonContainer);
        return container;
      }
      function addTaskCompleted (bookId){
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;

        bookTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();    
    }

    function findBook(bookId){
        for (const bookItem of books){
            if (bookItem.id === bookId){
                return bookItem;
            }
        }
        return null;
    }


    function removeTaskFromComplited(bookId){
        const bookTarget = findBookIndex(bookId);

        if (bookTarget === -1 ) return;

        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }


    function undoTaskFromCompleted(bookId){
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;

        bookTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }


    function findBookIndex(bookId){
        for (const index in books){
            if (books[index].id === bookId){
                return index;
            }
        }

        return -1;
    }


