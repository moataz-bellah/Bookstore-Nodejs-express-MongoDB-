const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MongoURI = 'mongodb+srv://whoami:dG1awObaBeCC87ur@cluster0.dqdhphe.mongodb.net/bookstore?retryWrites=true&w=majority';
const bodyParser = require('body-parser');
const multer = require('multer');
const dbConnection = require('./util/db_connection').mongoConnection;
const DB = require('./util/db_connection').getDb;
const store = new MongoDBStore({ uri: MongoURI, collection: 'sessions' });
const User = require('./models/user');
// const fileStorage = multer.diskStorage({destination:(req,file,cb)=>{
//     cb(null,'images');
// },filename:(req,file,cb)=>{
//     cb(null,new Date().toISOString() + '-'+file.originalname);
// }});
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

app.use(multer({ dest: 'pdfs' }).single('pdfFile'));
//app.use(multer({dest:'pdfs'}).single('bookPdfFile'));
//app.use(multer({dest:'pdfs'}).fields([{ name: 'pdfFile', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]));
const adminRoutes = require('./routes/admin');
const bookStoreRoutes = require('./routes/bookstore');
const authRoutes = require('./routes/auth');
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findUserById(req.session.user._id).then(user => {
        req.user = user;
        next();
    }).catch(err => { console.log(err); });
});
app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(bookStoreRoutes);
// app.use((req, res, next) => {
//     res.render('index');
//     next();
// });
dbConnection(() => {

    app.listen(3000);
});