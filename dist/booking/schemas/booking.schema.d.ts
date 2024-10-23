import { Document } from "mongoose";
export type BookingDocument = Booking & Document;
export declare class Booking {
    name: string;
    email: string;
    loginEmail: string;
    booking_id: string;
    booking_reference: string;
    offer_id: string;
    status: string;
    address1: string;
    address2: string;
    city: string;
    region: string;
    postal: string;
    country: string;
    createdOn: Date;
}
export declare const BookingSchema: import("mongoose").Schema<Document<Booking, any, any>, import("mongoose").Model<Document<Booking, any, any>, any, any>, undefined, {}>;
