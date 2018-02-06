"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
require("mongoose").Promise = global.Promise;
const mongoose = require("mongoose");
const path = require("path");
const logger = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3002;
const app = express();
const debug = require('debug')('memeredirect:server');
const http = require("http");
app.set('port', port);
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
function onError(error) {
    if (error.syscall !== 'listen')
        throw error;
    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
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
    console.log("Connected to MongoDB!");
});
const Link = new mongoose_1.Schema({
    url: String
});
const LinkModel = mongoose.model("Link", Link);
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.get("/", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield LinkModel.aggregate([
                { $sample: { size: 1 } }
            ]).exec();
            console.log(JSON.stringify(result));
            res.redirect(result[0].url);
        }
        catch (err) {
            console.log(err);
            next(err);
        }
    });
});
app.use(function (req, res, next) {
    next(404);
});
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error.pug");
});
