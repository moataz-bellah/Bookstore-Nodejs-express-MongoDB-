const mongodb = require('mongodb');
const db = require('./db_connection').getDb();
class MongoManager {
    static addDocument(collection, document) {
        return db.collection(collection).insertOne(document);
    }
    static getAllDocuments(collection) {
        return db.collection(collection).find().toArray();
    }
    static filterDocuments(collection, objectOfConditions) {
        return db.collection(collection).find(objectOfConditions);
    }
    static getOneDocument(collection, condition) {
        return db.collection(collection).find(condition).next();
    }
    static updateDocument(collection, updatedDocument) {}
    static deleteDocument(collection, condition) {}
}