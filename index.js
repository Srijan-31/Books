const {initializeDataBase}=require("./db/db.connect")
const express=require("express")
const app=express()
const Book=require("./book.models")

app.use(express.json())

initializeDataBase()

app.get("/",(req,res)=>{
    res.send("Hello!")
})

async function createBook(newBook){
    try{
        const book=new Book(newBook)
        const saveBook=await book.save()
        return saveBook
    }catch(error){
        console.log(error)
        throw error
    }
}

app.post("/books",async (req,res)=>{
    try{
        const savedBook=await createBook(req.body)
        res.status(201).json({message: "Book added successfully.",book: savedBook})
    }catch(error){
        console.log(error)
        res.status(500).json({error: "Failed to add the book."})
    }
})

async function readAllBooks(){
    try{
        const allBooks=await Book.find()
        return allBooks
    }catch(error){
        throw(error)
    }
}

app.get("/books", async (req,res)=>{
    try{
        const book=await readAllBooks()
        if(book.length!==0){
            res.json(book)
        }else{
            res.status(404).json({error: "Books not found."})
        }
    }catch(error){
        res.status(500).json({error:"Failed to fetch the book data."})
    }
})

async function readBookByTitle(bookTitle){
    try{
        const readBook=await Book.findOne({title: bookTitle})
        return readBook
    }catch(error){
        throw(error)
    }
}

app.get("/books/:bookTitle", async (req,res)=>{
    try{
        const book=await readBookByTitle(req.params.bookTitle)
        if(book){
            res.json(book)
        }else{
            res.status(404).json({error:"Book not found."})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({erro: "Failed to fetch the Book."})
    }
})

async function readBookByAuthor(authorName){
    try{
        const readBook=await Book.find({author: authorName})
        return readBook
    }catch(error){
        throw(error)
    }
}

app.get("/books/author/:authorName", async (req,res)=>{
    try{
        const book=await readBookByAuthor(req.params.authorName)
        if(book.length!==0){
            res.json(book)
        }else{
            res.status(404).json({error:"Book not found."})
        }
    }catch(error){
        res.status(500).json({error:"Failed to fetch the Book."})
    }
})

async function readBookByGenre(genre){
    try{
        const readBook=await Book.find({genre: genre})
        return readBook

    }catch(error){
        throw(error)
    }
}

app.get("/books/genre/:genreName", async (req,res)=>{
    try{
        const book=await readBookByGenre(req.params.genreName)
        if(book.lenth!==0){
            res.json(book)
        }else{
            res.status(404).json({error: "Book not found."})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Failed to fetch book."})
    }
})

async function readBookByPublishedYear(publishedYear){
    try{
        const readBook=await Book.findOne({publishedYear: publishedYear})
        return readBook
    }catch(error){
        throw(error)
    }
}

app.get("/books/publishedYear/:publishedYear", async (req,res)=>{
    try{
        const book=await readBookByPublishedYear(req.params.publishedYear)
        if(book){
            res.json(book)
        }else{
            res.status(404).json({error: "Book not found."})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Failed to fetch the book."})
    }
})

async function updateBookById(bookId,dataToBeUpdated){
    try{
        const updateBook=await Book.findByIdAndUpdate(bookId,dataToBeUpdated,{returnDocument:"after"})
        return updateBook
    }catch(error){
        throw(error)
    }
}

app.post("/books/:bookId", async (req,res)=>{
    try{
        const updatedBook=await updateBookById(req.params.bookId,req.body)
        if(updatedBook){
            res.status(200).json({message: "Book updated successfully.",updatedBook: updatedBook})
        }else{
            res.status(404).json({error: "Book not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to update Book"})
    }
})


async function updateBookByTitle(bookTitle, dataToBeUpdated){
    try{
        const updateBook=await Book.findOneAndUpdate({title: bookTitle},dataToBeUpdated,{returnDocument:"after"})
        return updateBook
    }catch(error){
        throw(error)
    }
}

app.post("/books/title/:bookTitle",async (req,res)=>{
    try{
        const updatedBook=await updateBookByTitle(req.params.bookTitle,req.body)
        if(updatedBook){
            res.status(200).json({message:"Book updated successfully.",updatedBook: updatedBook})
        }else{
            res.status(404).json({error:"Book not found."})
        }
    }catch(error){
        res.status(500).json({error:"Failed to update Book."})
    }
})

async function deleteBookById(bookId){
    try{
        const deleteBook=await Book.findByIdAndDelete(bookId)
        return deleteBook
    }catch(error){
        throw(error)
    }
}

app.delete("/books/:bookId", async (req,res)=>{
    try{
        const deletedBook=await deleteBookById(req.params.bookId)
        if(deletedBook){
            res.status(201).json({message: "Book deleted successfully."})
        }else{
            res.status(404).json({error: "Book not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to delete book."})
    }
})

const PORT=3000
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
