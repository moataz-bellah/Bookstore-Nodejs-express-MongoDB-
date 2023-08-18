const books = [];
const mongodb = require('mongodb');
const getDb = require('../util/db_connection').getDb;
class Book {
    constructor(id, title, price, description, imageUrl, author, category, bookPdf) {
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.author = author;
        this.category = category;
        this.bookPdf = bookPdf;
    }
    save() {

        const db = getDb();
        if (this._id) {
            return db.collection('books').updateOne({ _id: this._id }, { $set: this });
        } else {
            return db.collection('books').insertOne(this);
        }
    }

    static addBook(book) {
        books.push(book);
    }
    static fetchAllBooks() {
        const db = getDb();
        return db.collection('books').find().toArray();
    }
    static findBookById(id) {
        const db = getDb();
        return db.collection('books').find({ _id: new mongodb.ObjectId(id) }).next();
    }
    static deleteBookById(id) {
            const db = getDb();
            return db.collection('books').deleteOne({ _id: new mongodb.ObjectId(id) });
        }
        // for pagination
    static fetchForPagination(pageNumber, itemsPerPage) {
        const db = getDb();
        return db.collection('books').find().skip((pageNumber - 1) * itemsPerPage).limit(itemsPerPage).toArray();
    }
    static getCount() {
        const db = getDb();
        return db.collection('books').countDocuments({});

    }
}
module.exports = Book;