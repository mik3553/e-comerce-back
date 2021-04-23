const express   = require('express'),
    body_Parser = require('body-parser'),
    mongoose    = require('mongoose'),
    path        = require('path'),
    routes      = require('./routes/index'),
    port = 4000;

mongoose.Promise = global.Promise;
const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(body_Parser.json());

app.use((req, res, next) => {

     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
     res.setHeader("Access-Control-Allow-Headers", "authorization, xsrf, Origin, X-Requested-With, Content-Type, Accept");
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
     res.setHeader('Access-Control-Allow-Credentials', 'true');
     next();
 });

routes(app);

app.listen(port, () => {
    console.log('ecoute port: ', port);

    const URI = 'mongodb://localhost:27017/ecommerce';
    mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });
    mongoose.connection.on('connected', () => {
        console.log('connected to mongodb');
    });
    mongoose.connection.once('disconnected', () => {
        console.log('disconnected from mongoose');
    });
});



