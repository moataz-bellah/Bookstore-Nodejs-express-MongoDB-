const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnection = (callback) => {
    MongoClient.connect('mongodb+srv://whoami:dG1awObaBeCC87ur@cluster0.dqdhphe.mongodb.net/bookstore?retryWrites=true&w=majority').then(client => {
        console.log('Connected!!');
        _db = client.db();
        callback();
    }).catch(err => {
        console.log(err);
        throw err;
    });
};
const getDb = () => {
    if (_db) {
        return _db;
    } else {
        throw 'No Database Found';
    }
};


exports.mongoConnection = mongoConnection;
exports.getDb = getDb;