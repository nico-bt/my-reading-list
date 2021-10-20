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
showForm.addEventListener("click", ()=>{
    formNewBook.classList.toggle("hide")
    setTimeout(()=>titleInput.focus(), 100)
})
formCloseBtn.addEventListener("click", ()=>formNewBook.classList.toggle("hide"))

addBookBtn.addEventListener("click",(e)=>addBookToLibrary(e))

//===============================================================
// Functions
//===============================================================
let myLibrary = []

//Book object
function Book(title, author, amazonLink, isRead) {
    this.title = title;
    this.author = author;
    this.amazonLink = this.amazonLink
    this.isRead = isRead;
    this.toggleRead= function () {
        this.isRead= !this.isRead
    }
}

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
    displayBooks()
    
    titleInput.value =""
    authorInput.value=""
    amazonLinkInput.value=""
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

//Adding some default books to show
const book1 = new Book ("Atomic Habits", "James Clear", "www.amazon.com", true);
myLibrary.push(book1)

const book2 = new Book ("A Short History of Nearly Everything", " Bill Bryson", "www.amazon.com", false);
myLibrary.push(book2)

const book3 = new Book ("Thinking, Fast and Slow", " Daniel Kahneman", "www.amazon.com", false);
myLibrary.push(book3)

//Display each book of library in the HTML
function displayBooks() {
    libraryHtml.innerHTML="";

    myLibrary.forEach((book, index)=>{
        const newDiv = document.createElement("div");
        newDiv.innerHTML= `
            <div class="card text-center text-dark bg-dark h-100" style="width: 18rem;">
                <div class="card-body">
                    <span class="deleteBtn" data-book-index=${index}> <i class="far fa-trash-alt"></i> </span>
                    <h5 class="card-title">${book.title}</h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">${book.author} </li>
                    <li class="list-group-item">
                        <button class="toggleRead" data-book-index=${index}> 
                            ${book.isRead? "Leído  <i class='fa fa-solid fa-book readTrue'></i>" : "Por leer  <i class='fa fa-solid fa-book-open readFalse'></i>"}
                        </button>
                    </li>
                </ul>
                <div class="card-footer">
                    <small class="text-muted"><a href="#" class="card-link">Link to Amazon</a></small>
                </div>
            </div>`
        libraryHtml.appendChild(newDiv)
    })

    // Adding delete btn functionality
    // 1º Selecting deleteBtn recently added 2º deleting by "book-index" attribute
    deleteBtns = document.querySelectorAll(".deleteBtn")
    deleteBtns.forEach(btn=>{
    btn.addEventListener("click", (e)=> {
        myLibrary.splice(e.target.dataset.bookIndex,1)
        displayBooks()
        })
    })
    // Adding toggleRead btn functionality
    // 1º Selecting Btns recently added 2º toggle property by "book-index" attribute
    toggleReadBtns = document.querySelectorAll(".toggleRead")
    toggleReadBtns.forEach(btn=>{
    btn.addEventListener("click", (e)=> {
        let book =myLibrary[e.target.dataset.bookIndex]
        book.toggleRead()
        // console.log(e.target.dataset.bookIndex)
        displayBooks()
        })
    })
}

//Main, display on first load
displayBooks()