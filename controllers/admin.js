const Book = require('../models/book');
exports.getAddBook = (req, res, next) => {
    res.render('admin/edit-book', { editing: false, pageTitle: 'Add Book', path: '/admin/add-book' });
}

exports.postAddBook = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const bookPdf = req.file;
    const author = req.body.author;
    const category = req.body.category;
    const description = req.body.description;
    if (!bookPdf) {
        res.redirect('books');
    } else {
        const bookContent = bookPdf.path;
        const newBook = new Book(null, title, price, description, imageUrl, author, category, bookContent);
        newBook.save().then(result => {
            res.redirect('books');
        }).catch(err => {
            console.log(err);
        });
    }


};

exports.getBooks = (req, res, next) => {
    Book.fetchAllBooks().then(books => {
        res.render('admin/books', { books: books, pageTitle: 'Books', path: '/admin/books' });
    }).catch(err => {
        console.log(err);
    });

}

exports.getEditBook = (req, res, next) => {
    const bookId = req.params.bookId;
    Book.findBookById(bookId).then(book => {
        if (book) {
            res.render('admin/edit-book', { book: book, editing: true, pageTitle: 'Edit Book', path: '/admin/edit-book' });
        }
    }).catch(err => {
        console.log(err);
    });
};

exports.postEditBook = (req, res, next) => {
    const bookId = req.body.bookId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedCategody = req.body.category;
    const updatedAuthor = req.body.author;
    const updatedDescription = req.body.description;
    const bookFile = req.file;
    Book.findBookById(bookId).then(oldBook => {
        const book = new Book(oldBook._id);
        book.title = updatedTitle;
        book.price = updatedPrice;
        book.imageUrl = updatedImageUrl;
        book.category = updatedCategody;
        book.author = updatedAuthor;
        book.description = updatedDescription;
        if (bookFile) {
            book.bookPdf = bookFile.path;
        }
        return book.save();
    }).then(result => {
        res.redirect('books');
    }).catch(err => {
        console.log(err);
    });
};

exports.postDeleteBook = (req, res, next) => {
    const bookId = req.body.bookId;
    Book.deleteBookById(bookId).then(result => {
        res.redirect('books');
    }).catch(err => {
        console.log(err);
    });
};