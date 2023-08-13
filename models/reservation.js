const getDb = require('../util/db_connection').getDb;
const mongodb = require('mongodb');
class Reservation {
    constructor(id, email, bookId, startDate, endDate) {
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.email = email;
        this.bookId = bookId;
        this.startDate = startDate;
        this.endDate = endDate;
    }
    save() {
        const db = getDb();
        if (this._id) {

        } else {
            return db.collection('reservations').insertOne(this);
        }
    }
    static fetchAll() {
        const db = getDb();
        return db.collection('reservations').find().toArray();
    }
}
module.exports = Reservation;