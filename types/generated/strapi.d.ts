import { Server } from "socket.io";

declare module "@strapi/strapi" {
  export interface Strapi {
    io: Server;
  }
}