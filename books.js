//===============================================================
// Select elements
//===============================================================
const libraryHtml = document.querySelector("#library");
const showForm = document.querySelector("#showForm")
const formNewBook = document.querySelector("#formNewBook");

//formItems
const formCloseBtn = document.querySelector(".fa-window-close")
const titleInput = document.querySelector("#title")
const authorInput = document.querySelector("#author")
const isReadInput = document.querySelector("#isRead")
const amazonLinkInput = document.querySelector("#amazonLink")
const addBookBtn = document.querySelector("#addBook")
let deleteBtns = document.querySelectorAll(".deleteBtn")
let toggleReadBtns = document.querySelectorAll(".toggleRead")

//===============================================================
// Event Listeners
//===============================================================
showForm.addEventListener("click", showFormAndFocus)

formCloseBtn.addEventListener("click", closeForm)

addBookBtn.addEventListener("click",(e)=> addBookToLibrary(e))

//===============================================================
// Functions
//===============================================================
function showFormAndFocus(){
    formNewBook.classList.toggle("hide")
    setTimeout(()=>titleInput.focus(), 100)
}
function closeForm(){
    formNewBook.classList.toggle("hide")
}

//Book object
function Book(title, author, amazonLink, isRead) {
    this.title = title;
    this.author = author;
    this.amazonLink = amazonLink
    this.isRead = isRead;
}
Book.prototype.toggleRead = function () {
    this.isRead= !this.isRead
}

let myLibrary = []
//Take input values, create a book object and add it to myLibrary array
function addBookToLibrary(e) {
    
    e.preventDefault(e.target)

    if (titleInput.value=="") {
        inputValidation(titleInput)
        return
    }
    if (authorInput.value=="") {
        inputValidation(authorInput)
        return
    }

    const newBook= new Book(titleInput.value, authorInput.value, amazonLinkInput.value, isReadInput.checked)
    myLibrary.push(newBook)
    sendLibToLocalStorage(myLibrary)
    displayBooks()
    
    // Clear input values and hide form
    titleInput.value =""
    authorInput.value=""
    amazonLinkInput.value=""
    isReadInput.checked=false
    formNewBook.classList.add("hide")
    titleInput.classList.remove("formValidation")
    authorInput.classList.remove("formValidation")
}

// Form Validation
function inputValidation(input) {
    input.classList.add("formValidation")
    input.focus()
    input.addEventListener("input",()=>{
        input.classList.remove("formValidation")
    })
}

//Display each book of library in the HTML
function displayBooks() {
    libraryHtml.innerHTML="";

    myLibrary.forEach((book, index)=>{
        const newDiv = document.createElement("div");
        newDiv.innerHTML= `
            <div class="card text-center text-dark bg-dark h-100" style="width: 18rem;">
                <div class="card-body">
                    <span class="deleteBtn"> <i class="far fa-trash-alt" data-book-index=${index}></i> </span>
                    <h5 class="card-title">${book.title}</h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">${book.author} </li>
                    <li class="list-group-item">
                        <button class="toggleRead" data-book-index=${index}> 
                            ${book.isRead? "Le??do  <i class='fa fa-solid fa-book readTrue'></i>" : "Por leer  <i class='fa fa-solid fa-book-open readFalse'></i>"}
                        </button>
                    </li>
                </ul>
                <div class="card-footer">
                    <small class="text-muted"><a href="${book.amazonLink}" target='_blank' class="card-link">${book.amazonLink? "Book link":"" } </a></small>
                </div>
            </div>`
        libraryHtml.appendChild(newDiv)
    })

    // Adding delete btn functionality
    // 1?? Selecting deleteBtn recently added 2?? deleting by "book-index" attribute
    deleteBtns = document.querySelectorAll(".deleteBtn")
    deleteBtns.forEach(btn=>{
    btn.addEventListener("click", (e)=> {
        // console.log(e.target.dataset.bookIndex)
        myLibrary.splice(e.target.dataset.bookIndex,1)
        sendLibToLocalStorage(myLibrary)
        displayBooks()
        })
    })
    // Adding toggleRead btn functionality
    // 1?? Selecting Btns recently added 2?? toggle property by "book-index" attribute
    toggleReadBtns = document.querySelectorAll(".toggleRead")
    toggleReadBtns.forEach(btn=>{
    btn.addEventListener("click", (e)=> {
        let book =myLibrary[e.target.dataset.bookIndex]
        book.toggleRead()
        // console.log(e.target.dataset.bookIndex)
        sendLibToLocalStorage(myLibrary)
        displayBooks()
        })
    })
    // Display message if there is no books
    if (myLibrary.length==0) {
        libraryHtml.innerHTML="<h2 style='color:white'>Your list is empty. Add a new book to read</h2>";
    }
}

//===============================================================
// Local Storage
//===============================================================
function checkIfLocalStorage(){
    if (localStorage.library) {
        // Retrieve data into myLibrary
        let libraryArray = JSON.parse(localStorage.library)
        libraryArray.forEach(item => {
            let newBook = new Book(item.title, item.author, item.amazonLink, item.isRead)
            myLibrary.push(newBook)
        })
    } else {
        //Adding some default books to show
        const book0 = new Book ("Ficciones", "Jorge Luis Borges", "https://www.amazon.com/-/es/Jorge-Luis-Borges/dp/0307950921", true);
        myLibrary.push(book0)

        const book1 = new Book ("Atomic Habits", "James Clear", "https://www.amazon.com/-/en/James-Clear/dp/0735211299", true);
        myLibrary.push(book1)
        
        const book2 = new Book ("A Short History of Nearly Everything", " Bill Bryson", "https://www.amazon.com/-/en/Bill-Bryson/dp/076790818X", false);
        myLibrary.push(book2)
    }
}

// To copy myLibrary to LocalStorage
function sendLibToLocalStorage(library){
    let jsonLibrary = JSON.stringify(library)
    localStorage.setItem("library", jsonLibrary)
}

//===============================================================
//Main: display on first load
//===============================================================
checkIfLocalStorage()
displayBooks()
