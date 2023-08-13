const path = require('path');
const express = require('express');
const adminController = require('../controllers/admin');
const bookStoreController = require('../controllers/bookstore');
const router = express.Router();

router.get('/add-book', adminController.getAddBook);
router.post('/add-book', adminController.postAddBook);
router.get('/books', adminController.getBooks);
router.get('/edit-book/:bookId', adminController.getEditBook);
router.post('/edit-book', adminController.postEditBook);
router.post('/delete-book', adminController.postDeleteBook);
router.get('/reservations', adminController.getReservations);
router.get('/signup', adminController.getAdminSignup);
router.post('/signup', adminController.postAdminSignup);
router.get('/admin-login', adminController.getAdminLogin);
router.post('/admin-login', adminController.postAdminLogin);
router.get('/', bookStoreController.getBooks);
module.exports = router;