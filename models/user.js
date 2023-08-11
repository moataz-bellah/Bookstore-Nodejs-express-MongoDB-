const mongodb = require('mongodb');
const getDb = require('../util/db_connection').getDb;

class User {
    constructor(id, username, email, password, library, cart) {
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.username = username;
        this.email = email;
        this.password = password;
        this.library = library;
        this.cart = cart;
    }
    save() {
        const db = getDb();
        if (this._id) {
            return db.collection('users').updateOne({ _id: this._id }, { $set: this })
        } else {
            return db.collection('users').insertOne(this);
        }

    }

    reserveBook(book, startDate, endDate) {
        //const currentDate = new Date();
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        console.log(endDate);
        //const endDate = currentDate.setDate(currentDate.getDate() + 15);
        this.library.push({ bookId: book._id, startData: startDate, endDate: endDate, expired: false });
    }
    foundInLibrary(bookId) {

        const bookIndex = this.library.findIndex(book => book.bookId.toString() === bookId.toString());
        console.log(bookIndex);
        console.log(this.library);
        if (bookIndex >= 0) {
            return true;
        }
        return false;
    }
    isExpired(bookId) {
        const book = this.library.find(b => b.bookId.toString() === bookId.toString());
        const currentDate = new Date().getTime();
        if (currentDate > book.endDate.getTime()) {
            return true;
        }
        return false;
    }
    static fetchAllUsers() {
        const db = getDb();
        return db.collection('users').find().toArray();
    }
    static findUserById(id) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new mongodb.ObjectId(id) });
    }
    static findUserByEmail(email) {
        const db = getDb();
        return db.collection('users').findOne({ email: email });
    }
}

module.exports = User;