import { Document } from 'mongoose';
export type BookingDocument = Booking & Document;
export declare class Booking {
    userName: string;
    name: string;
    email: string;
    user_id: string;
    booking_id: string;
    booking_reference: string;
    offer_id: string;
    status: string;
    createdOn: Date;
}
export declare const BookingSchema: import("mongoose").Schema<Document<Booking, any, any>, import("mongoose").Model<Document<Booking, any, any>, any, any>, undefined, {}>;
