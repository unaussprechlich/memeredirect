import * as Hapi from "hapi"
import {links} from "./Links";

export class Service{

    readonly server: Hapi.Server;
    static INSTANCE : Service;

    private constructor(){
        this.server = new Hapi.Server({
            host : '0.0.0.0',
            port : process.env.PORT || 3000
        });

        this.server.route({
            method: 'GET',
            path: '/{path*}',
            handler: async (request, h) => {
                try {
                    const url = links[Math.floor(Math.random()*links.length)].toString()
                    console.log(new Date().toISOString() + " | "+ url);
                    return h.redirect(url)
                }catch (e) {
                    console.error(e);
                    return e
                }
            }
        });

        this.server.route({
            method: 'GET',
            path: "/link",
            handler: async (request) => {
                try{
                    const url = links[Math.floor(Math.random()*links.length)].toString()
                    console.log(new Date().toISOString() + " | "+ url);
                    return url;
                }catch (e) {
                    console.error(e);
                    return e
                }
            },
            options : {
                cors : true
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

    //Singleton
    static async start() : Promise<Service>{
        if(Service.INSTANCE) return Service.INSTANCE;
        try {
            Service.INSTANCE = new Service();
            await Service.INSTANCE.server.start();
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            console.log(`Server running at: ${Service.INSTANCE.server.info.uri}`);
            console.log("Service: Memeredirect");
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
        } catch (e) {
            console.log(e);
        }
        return Service.INSTANCE;
    }
}

Service.start().catch(console.error);
