const Book = require('../models/book');
const Reservation = require('../models/reservation');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
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

exports.getReservations = (req, res, next) => {
    Reservation.fetchAll().then(reservations => {
        res.render('admin/reservations', { reservations: reservations, pageTitle: 'Rservations', path: '/admin/reservation' });
    }).catch(err => {
        console.log(err);
    });
};

exports.getAdminSignup = (req, res, next) => {
    res.render('admin/signup', { pageTitle: 'Signup', path: '/admin/signup' });
};

exports.postAdminSignup = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findUserByEmail(email).then(user => {
        if (user) {
            res.redirect('signup');
        } else {
            bcrypt.hash(password, 12).then(hashedPassword => {
                const newUser = new User(null, username, email, hashedPassword, null, null, true);
                newUser.save().then(result => {
                    res.redirect('books');
                }).catch(err => { console.log(err); });
            }).catch(err => { console.log(err); });
        }
    }).catch(err => { console.log(err); });
};
exports.getAdminLogin = (req, res, next) => {
    res.render('admin/login', { pageTitle: 'Login', path: '/admin/login' });
};

exports.postAdminLogin = (req, res, next) => {
    exports.postLogin = (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;
        User.findUserByEmail(email).then(user => {
            if (!user) {
                res.redirect('admin-login');
            } else if (!user.isAdmin) {
                res.redirect('admin-login');
            } else {

                bcrypt.compare(password, user.password).then(isMatch => {
                    if (isMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            res.redirect('books');
                        });
                    } else {
                        res.redirect('admin-login');
                    }
                }).catch(err => { console.log(err); })
            }
        }).catch(err => { console.log(err); });
    };
};