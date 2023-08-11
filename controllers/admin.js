const Book = require('../models/book');
exports.getAddBook = (req, res, next) => {
    res.render('admin/edit-book', { editing: false, pageTitle: 'Add Book', path: '/admin/add-book' });
}

exports.postAddBook = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    console.log('=========================================');
    const imageUrl = req.body.imageUrl;
    const bookPdf = req.file;
    const author = req.body.author;
    const category = req.body.category;
    const description = req.body.description;
    if(!bookPdf){
        res.redirect('books');
    }
    else{
        const bookContent = bookPdf.path;
        console.log('THE PATH ',bookContent);
        const newBook = new Book(null, title, price, description, imageUrl, author, category,bookContent);
        newBook.save().then(result => {
        console.log(result);
        res.redirect('books');
    }).catch(err => {
        console.log(err);
    });    
    }
    

};

exports.getBooks = (req, res, next) => {
    Book.fetchAllBooks().then(books => {
        console.log(books);
        res.render('admin/books', { books: books, pageTitle: 'Books', path: '/admin/books' });
    }).catch(err => {
        console.log(err);
    });

}