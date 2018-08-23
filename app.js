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
const Hapi = require("hapi");
const Links_1 = require("./Links");
class Service {
    constructor() {
        this.server = new Hapi.Server({
            host: '0.0.0.0',
            port: process.env.PORT || 3000
        });
        this.server.route({
            method: 'GET',
            path: '/{path*}',
            handler: (request, h) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const url = Links_1.links[Math.floor(Math.random() * Links_1.links.length)].toString();
                    console.log(new Date().toISOString() + " | " + url);
                    return h.redirect(url);
                }
                catch (e) {
                    console.error(e);
                    return e;
                }
            })
        });
        this.server.route({
            method: 'GET',
            path: "/link",
            handler: (request) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const url = Links_1.links[Math.floor(Math.random() * Links_1.links.length)].toString();
                    console.log(new Date().toISOString() + " | " + url);
                    return url;
                }
                catch (e) {
                    console.error(e);
                    return e;
                }
            }),
            options: {
                cors: true
            }
        });
        this.server.route({
            method: 'GET',
            path: "/health",
            handler: (request, h) => {
                return "Thx, I'm fine!";
            }
        });
        Service.INSTANCE = this;
    }
    static start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Service.INSTANCE)
                return Service.INSTANCE;
            try {
                Service.INSTANCE = new Service();
                yield Service.INSTANCE.server.start();
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                console.log(`Server running at: ${Service.INSTANCE.server.info.uri}`);
                console.log("Service: Memeredirect");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
            }
            catch (e) {
                console.log(e);
            }
            return Service.INSTANCE;
        });
    }
}
exports.Service = Service;
Service.start().catch(console.error);
