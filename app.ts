import {Schema} from "mongoose";
require("mongoose").Promise = global.Promise;
import  * as mongoose from "mongoose";
import * as path from "path"
import * as logger from 'morgan'
import * as express from "express"

import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');

const port = process.env.PORT || 3002;

const app = express();

const debug = require('debug')('memeredirect:server');
import http = require('http');

app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if (error.syscall !== 'listen') throw error;

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

mongoose.connect('mongodb://localhost/memeredirect').then(() => {
    console.log("Connected to MongoDB!")
});

interface ILink extends mongoose.Document{
    url : String
}

const Link = new Schema({
    url : String
});

const LinkModel = mongoose.model<ILink>("Link", Link);


// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.get("/*", async function (req, res, next) {
    try{
        const result = await LinkModel.aggregate([
            { $sample: { size: 1 } }
        ]).exec() ;
        console.log(JSON.stringify(result));
        res.status(302);
        res.redirect(result[0].url);
    }catch (err){
        console.log(err);
        next(err)
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(404);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status|| 500);
    res.render("error.pug");
});
