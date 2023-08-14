const Book = require('../models/book');
const User = require('../models/user');
const Reservation = require('../models/reservation');
const fs = require('fs');
const path = require('path');

exports.getBooks = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    Book.fetchAllBooks().then(books => {
        res.render('index', { books: books, pageTitle: 'Books', isLoggedIn: req.session.isLoggedIn, user: req.user.username });
    }).catch(err => {
        console.log(err);
    });
};


exports.getBookDetail = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    const bookId = req.params.bookId;
    console.log(bookId);
    Book.findBookById(bookId).then(book => {
        User.findUserByEmail(req.user.email).then(user => {

            if (user) {
                const newUser = new User(user._id, user.username, user.email, user.password, user.library, user.cart);

                if (newUser.foundInLibrary(bookId) && !newUser.isExpired(bookId)) {

                    res.render('book_details', { book: book, expired: false, pageTitle: 'Book Details', isLoggedIn: req.session.isLoggedIn, user: req.user.username });
                } else {
                    res.render('book_details', { book: book, expired: true, pageTitle: 'Book Details', isLoggedIn: req.session.isLoggedIn, user: req.user.username });
                }
            }
        }).catch(err => {
            console.log(err);
        });

    }).catch(err => { console.log(err) });

};

exports.getReservate = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    const bookId = req.params.bookId;
    Book.findBookById(bookId).then(book => {
        if (book) {
            const d = new Date();
            const startDate = d.toDateString();
            const endDate = new Date(d.setDate(d.getDate() + 15));

            res.render('book_summary', { book: book, startDate: startDate, endDate: endDate.toDateString(), isLoggedIn: req.session.isLoggedIn, user: req.user.username });
        } else {
            res.redirect('/');
        }

    }).catch(err => {
        console.log(err);
    })

};

exports.postReserveBook = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    const bookId = req.body.bookId;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    Book.findBookById(bookId).then(book => {
        User.findUserByEmail(req.user.email).then(user => {
            if (user) {
                const reservation = new Reservation(null, user.email, bookId, startDate, endDate);

                user = new User(user._id, user.username, user.email, user.password, user.library, user.cart);
                user.reserveBook(book, startDate, endDate);
                user.save().then(result => {
                    reservation.save().then(result => {
                        res.redirect('/');
                    }).catch(err => {
                        console.log(err);
                    });

                }).catch(err => {
                    console.log(err);
                });
            }

        }).catch(err => {
            console.log(err);
        });
        //        const user = new User('elliot', 'elliot@alderson.com', 'password', [], []);
    }).catch(err => {
        console.log(err);
    });
};
exports.getBookContent = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    const bookId = req.params.bookId;
    Book.findBookById(bookId).then(book => {
        if (book) {
            const bookFilePath = book.bookPdf;
            res.render('pdf_viewer', { book: bookFilePath });
            //            const file = fs.createReadStream(bookFilePath);
            // const file = fs.readFile(bookFilePath, (err, data) => {
            //     if (!err) {
            //         res.contentType("application/pdf");
            //         res.send(data);
            //     } else {
            //         console.log('ERRORRR ', err);
            //     }
            // });


            //            file.pipe(res);
        }
    }).catch(err => {
        console.log(err);
    });

};


exports.getLibrary = (req, res, next) => {
    const user = new User(req.user._id, req.user.username, req.user.email, req.user.password, req.user.library, req.user.cart);
    const myLibrary = user.fetchMyLibrary();

    res.render('library', { myLibrary: myLibrary, isLoggedIn: req.session.isLoggedIn, user: user.username });
};