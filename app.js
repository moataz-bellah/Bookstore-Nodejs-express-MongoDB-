const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const dbConnection = require('./util/db_connection').mongoConnection;
const DB = require('./util/db_connection').getDb;
// const fileStorage = multer.diskStorage({destination:(req,file,cb)=>{
//     cb(null,'images');
// },filename:(req,file,cb)=>{
//     cb(null,new Date().toISOString() + '-'+file.originalname);
// }});
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

app.use(multer({ dest: 'pdfs' }).single('pdfFile'));
//app.use(multer({dest:'pdfs'}).single('bookPdfFile'));
//app.use(multer({dest:'pdfs'}).fields([{ name: 'pdfFile', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]));
const adminRoutes = require('./routes/admin');
const bookStoreRoutes = require('./routes/bookstore');
const authRoutes = require('./routes/auth');
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