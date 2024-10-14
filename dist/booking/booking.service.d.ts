import { Model } from "mongoose";
import { Booking, BookingDocument } from "./schemas/booking.schema";
export declare class BookingService {
    private bookingModel;
    constructor(bookingModel: Model<BookingDocument>);
    create(createBookingDto: any): Promise<Booking>;
    findAll(email: string): Promise<Booking[] | null>;
    findById(id: string): Promise<Booking | null>;
    update(id: string, updateBookingDto: any): Promise<Booking | null>;
    updateStatus(id: string, userId: string, status: string): Promise<BookingDocument | null>;
    delete(id: string): Promise<Booking | null>;
}
