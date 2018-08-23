import * as Hapi from "hapi";
export declare class Service {
    readonly server: Hapi.Server;
    static INSTANCE: Service;
    private constructor();
    static start(): Promise<Service>;
}
